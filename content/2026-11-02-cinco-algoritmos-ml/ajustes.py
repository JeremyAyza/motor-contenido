"""Fit the five models on the real Iris dataset and write ajustes.json.

Every number the video shows comes from this file. One real flower is held out of
every fit: the five models answer about it without having seen it.

Needs numpy and scikit-learn:
    python ajustes.py
"""

import json
from pathlib import Path

import numpy as np
import sklearn
from sklearn.datasets import load_iris
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.model_selection import LeaveOneOut, cross_val_score
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier, export_text

iris = load_iris()
NAMES = [str(n) for n in iris.target_names]
SETOSA, VERSICOLOR, VIRGINICA = 0, 1, 2
# Row 120 of the dataset (index 119): it sits where versicolor and virginica overlap.
HIDDEN = 119

plane_all = iris.data[:, 2:4]  # petal length, petal width (cm)
species_all = iris.target
keep = np.arange(len(plane_all)) != HIDDEN
plane = plane_all[keep]
species = species_all[keep]
length = plane[:, 0]
width = plane[:, 1]
hidden = plane_all[HIDDEN : HIDDEN + 1]
hidden_length = hidden[:, :1]


def rounded(value, digits=4):
    return round(float(value), digits)


def as_point(row):
    return {"x": rounded(row[0], 2), "y": rounded(row[1], 2)}


# 1. Linear regression with its defaults: petal length -> petal width.
linear = LinearRegression().fit(length.reshape(-1, 1), width)
linear_out = {
    "slope": rounded(linear.coef_[0]),
    "intercept": rounded(linear.intercept_),
    "r2": rounded(linear.score(length.reshape(-1, 1), width)),
    "sse": rounded(np.sum((width - linear.predict(length.reshape(-1, 1))) ** 2)),
    "hiddenPrediction": rounded(linear.predict(hidden_length)[0]),
    "hiddenReal": rounded(hidden[0][1], 2),
}

# 2. Logistic regression with its defaults: is it virginica, from petal length alone?
is_virginica = (species == VIRGINICA).astype(int)
logistic = LogisticRegression().fit(length.reshape(-1, 1), is_virginica)
grid_x = np.arange(0.0, 7.51, 0.05)
logistic_out = {
    "b0": rounded(logistic.intercept_[0]),
    "b1": rounded(logistic.coef_[0][0]),
    "cutAt50": rounded(-logistic.intercept_[0] / logistic.coef_[0][0]),
    "hiddenProbability": rounded(logistic.predict_proba(hidden_length)[0][1]),
    "accuracy": rounded(logistic.score(length.reshape(-1, 1), is_virginica)),
    "curve": [[rounded(x, 2), rounded(p)] for x, p in zip(grid_x, logistic.predict_proba(grid_x.reshape(-1, 1))[:, 1])],
}

# 3. Decision tree with three questions: three cuts, four rectangles.
tree = DecisionTreeClassifier(max_leaf_nodes=4, random_state=0).fit(plane, species)
t = tree.tree_
tree_out = {
    "text": export_text(tree, feature_names=["petal_length", "petal_width"]),
    "cuts": [
        {"feature": ["length", "width"][t.feature[n]], "threshold": rounded(t.threshold[n]), "samples": int(t.n_node_samples[n])}
        for n in range(t.node_count)
        if t.feature[n] >= 0
    ],
    "leaves": [
        {
            "samples": int(t.n_node_samples[n]),
            "counts": [int(round(c * t.n_node_samples[n])) for c in t.value[n][0]],
        }
        for n in range(t.node_count)
        if t.feature[n] < 0
    ],
    "correct": int((tree.predict(plane) == species).sum()),
    "accuracy": rounded(tree.score(plane, species)),
    "hiddenAnswer": NAMES[tree.predict(hidden)[0]],
}

# 4. SVM. A hard margin on the pair a line can separate.
pair = species != VIRGINICA
pair_idx = np.flatnonzero(pair)
hard = SVC(kernel="linear", C=1e6).fit(plane[pair], species[pair])
support_idx = pair_idx[hard.support_]
# The claim on screen: with only the support vectors, the line does not move.
refit = SVC(kernel="linear", C=1e6).fit(plane[support_idx], species[support_idx])
moved = float(np.max(np.abs(np.r_[hard.coef_[0] - refit.coef_[0], hard.intercept_ - refit.intercept_])))
svm_out = {
    "pair": ["setosa", "versicolor"],
    "pairSize": int(pair.sum()),
    "w": [rounded(v, 6) for v in hard.coef_[0]],
    "b": rounded(hard.intercept_[0], 6),
    "margin": rounded(2 / np.linalg.norm(hard.coef_[0])),
    "support": [as_point(plane[i]) for i in support_idx],
    "refitMoved": moved,
    "hiddenAnswer": NAMES[SVC(kernel="linear").fit(plane, species).predict(hidden)[0]],
    "hiddenAnswerRbf": NAMES[SVC().fit(plane, species).predict(hidden)[0]],
}

# The kernel trick, on the pair that overlaps.
overlap = species != SETOSA
x_overlap = plane[overlap]
y_overlap = species[overlap]
straight = SVC(kernel="linear").fit(x_overlap, y_overlap)
bent = SVC(kernel="rbf", C=1000, gamma=2).fit(x_overlap, y_overlap)


def boundary(model, xs, ys):
    """Marching squares over the decision function: the boundary as line segments and,
    row by row, the stretches on the versicolor side (decision < 0)."""
    gx, gy = np.meshgrid(xs, ys)
    f = model.decision_function(np.c_[gx.ravel(), gy.ravel()]).reshape(gx.shape)
    runs = []
    for j in range(len(ys) - 1):
        inside = f[j, :-1] < 0
        start = None
        for i, on in enumerate(list(inside) + [False]):
            if on and start is None:
                start = i
            if not on and start is not None:
                runs.append([rounded(xs[start], 3), rounded(xs[i], 3), rounded(ys[j], 3), rounded(ys[j + 1], 3)])
                start = None
    segments = []
    for j in range(len(ys) - 1):
        for i in range(len(xs) - 1):
            corners = [
                (xs[i], ys[j], f[j, i]),
                (xs[i + 1], ys[j], f[j, i + 1]),
                (xs[i + 1], ys[j + 1], f[j + 1, i + 1]),
                (xs[i], ys[j + 1], f[j + 1, i]),
            ]
            crossings = []
            for a, b in zip(corners, corners[1:] + corners[:1]):
                if (a[2] < 0) != (b[2] < 0):
                    p = a[2] / (a[2] - b[2])
                    crossings.append((a[0] + p * (b[0] - a[0]), a[1] + p * (b[1] - a[1])))
            if len(crossings) == 2:
                segments.append([[rounded(v, 3) for v in crossings[0]], [rounded(v, 3) for v in crossings[1]]])
    return segments, runs


bent_segments, bent_runs = boundary(bent, np.arange(0.0, 7.41, 0.04), np.arange(0.0, 2.76, 0.02))
kernel_out = {
    "straight": {"params": "linear, C=1", "train": rounded(straight.score(x_overlap, y_overlap))},
    "bent": {"params": "rbf, C=1000, gamma=2", "train": rounded(bent.score(x_overlap, y_overlap))},
    "crossValidation5": {
        "straight": rounded(cross_val_score(SVC(kernel="linear"), x_overlap, y_overlap, cv=5).mean()),
        "bent": rounded(cross_val_score(SVC(kernel="rbf", C=1000, gamma=2), x_overlap, y_overlap, cv=5).mean()),
    },
    "straightLine": {"w": [rounded(v, 6) for v in straight.coef_[0]], "b": rounded(straight.intercept_[0], 6)},
    "bentSegments": bent_segments,
    "bentVersicolorRuns": bent_runs,
    "hiddenAnswerBent": NAMES[bent.predict(hidden)[0]],
}
svm_out["kernel"] = kernel_out

# 5. KNN with its defaults (k = 5). No fit worth the name: it keeps the flowers.
knn = KNeighborsClassifier().fit(plane, species)
distances, neighbours = knn.kneighbors(hidden)
votes = species[neighbours[0]]
knn_out = {
    "k": knn.n_neighbors,
    "neighbours": [
        {**as_point(plane[i]), "species": NAMES[species[i]], "distance": rounded(d)}
        for i, d in zip(neighbours[0], distances[0])
    ],
    "votes": {NAMES[k]: int((votes == k).sum()) for k in range(3)},
    "hiddenAnswer": NAMES[knn.predict(hidden)[0]],
    "distancesPerPrediction": len(plane),
}

# All together: each flower, hidden in turn, over the whole dataset.
loo = LeaveOneOut()
x1 = plane_all[:, :1]
virginica_all = (species_all == VIRGINICA).astype(int)
leave_one_out = {
    "logistic_virginica_or_not": rounded(cross_val_score(LogisticRegression(), x1, virginica_all, cv=loo).mean()),
    "tree": rounded(cross_val_score(DecisionTreeClassifier(max_leaf_nodes=4, random_state=0), plane_all, species_all, cv=loo).mean()),
    "svm_linear": rounded(cross_val_score(SVC(kernel="linear"), plane_all, species_all, cv=loo).mean()),
    "knn": rounded(cross_val_score(KNeighborsClassifier(), plane_all, species_all, cv=loo).mean()),
}

out = {
    "dataset": "Iris (Fisher, 1936; measured by Anderson), sklearn.datasets.load_iris",
    "versions": {"sklearn": sklearn.__version__, "numpy": np.__version__},
    "species": NAMES,
    "flowers": [{**as_point(p), "species": int(s)} for p, s in zip(plane, species)],
    "hidden": {**as_point(hidden[0]), "row": HIDDEN + 1, "species": NAMES[species_all[HIDDEN]]},
    "linear": linear_out,
    "logistic": logistic_out,
    "tree": tree_out,
    "svm": svm_out,
    "knn": knn_out,
    "leaveOneOut": leave_one_out,
}

Path(__file__).with_name("ajustes.json").write_text(json.dumps(out, indent=1) + "\n", encoding="utf-8")

summary = {k: v for k, v in out.items() if k != "flowers"}
summary["logistic"] = {k: v for k, v in logistic_out.items() if k != "curve"}
summary["svm"] = {**svm_out, "kernel": {k: v for k, v in kernel_out.items() if k not in ("bentSegments", "bentVersicolorRuns")}}
print(json.dumps(summary, indent=1))
print("segments of the bent boundary:", len(kernel_out["bentSegments"]))
