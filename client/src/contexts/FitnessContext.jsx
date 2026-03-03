import React, { createContext, useContext, useState, useCallback } from "react";
const FitnessContext = createContext({});
export const useFitness = () => useContext(FitnessContext);
function loadState(key, fallback) {
    const saved = localStorage.getItem(`fitforge_${key}`);
    return saved ? JSON.parse(saved) : fallback;
}
function saveState(key, value) {
    localStorage.setItem(`fitforge_${key}`, JSON.stringify(value));
}
export const FitnessProvider = ({ children }) => {
    const [workouts, setWorkouts] = useState(() => loadState("workouts", []));
    const [progress, setProgress] = useState(() => loadState("progress", []));
    const [meals, setMeals] = useState(() => loadState("meals", []));
    const [goal, setGoalState] = useState(() => loadState("goal", null));
    const [posts, setPosts] = useState(() => loadState("posts", []));
    const addWorkout = useCallback((w) => {
        setWorkouts(prev => {
            const next = [...prev, { ...w, id: crypto.randomUUID() }];
            saveState("workouts", next);
            return next;
        });
    }, []);
    const updateWorkout = useCallback((id, data) => {
        setWorkouts(prev => {
            const next = prev.map(w => w.id === id ? { ...w, ...data } : w);
            saveState("workouts", next);
            return next;
        });
    }, []);
    const deleteWorkout = useCallback((id) => {
        setWorkouts(prev => {
            const next = prev.filter(w => w.id !== id);
            saveState("workouts", next);
            return next;
        });
    }, []);
    const toggleWorkoutComplete = useCallback((id) => {
        setWorkouts(prev => {
            const next = prev.map(w => w.id === id ? { ...w, completed: !w.completed } : w);
            saveState("workouts", next);
            return next;
        });
    }, []);
    const addProgress = useCallback((p) => {
        setProgress(prev => {
            const bmi = p.weight && 1.75 ? +(p.weight / (1.75 * 1.75)).toFixed(1) : undefined;
            const next = [...prev, { ...p, id: crypto.randomUUID(), bmi }];
            saveState("progress", next);
            return next;
        });
    }, []);
    const addMeal = useCallback((m) => {
        setMeals(prev => {
            const next = [...prev, { ...m, id: crypto.randomUUID() }];
            saveState("meals", next);
            return next;
        });
    }, []);
    const setGoal = useCallback((g) => {
        setGoalState(g);
        saveState("goal", g);
    }, []);
    const addPost = useCallback((p) => {
        setPosts(prev => {
            const next = [...prev, { ...p, id: crypto.randomUUID(), likes: [], comments: [], date: new Date().toISOString() }];
            saveState("posts", next);
            return next;
        });
    }, []);
    const likePost = useCallback((postId, userId) => {
        setPosts(prev => {
            const next = prev.map(p => {
                if (p.id !== postId)
                    return p;
                const likes = p.likes.includes(userId) ? p.likes.filter(id => id !== userId) : [...p.likes, userId];
                return { ...p, likes };
            });
            saveState("posts", next);
            return next;
        });
    }, []);
    const addComment = useCallback((postId, comment) => {
        setPosts(prev => {
            const next = prev.map(p => {
                if (p.id !== postId)
                    return p;
                return { ...p, comments: [...p.comments, { ...comment, id: crypto.randomUUID(), date: new Date().toISOString() }] };
            });
            saveState("posts", next);
            return next;
        });
    }, []);
    const deletePost = useCallback((id) => {
        setPosts(prev => {
            const next = prev.filter(p => p.id !== id);
            saveState("posts", next);
            return next;
        });
    }, []);
    return (<FitnessContext.Provider value={{
            workouts, addWorkout, updateWorkout, deleteWorkout, toggleWorkoutComplete,
            progress, addProgress,
            meals, addMeal,
            goal, setGoal,
            posts, addPost, likePost, addComment, deletePost,
        }}>
      {children}
    </FitnessContext.Provider>);
};
