import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";

const FitnessContext = createContext({});
export const useFitness = () => useContext(FitnessContext);

const FITNESS_CACHE_PREFIX = "fitverse_fitness_cache:";

const getCacheKey = (userId) => `${FITNESS_CACHE_PREFIX}${userId}`;

const readFitnessCache = (userId) => {
    if (!userId || typeof window === "undefined") {
        return null;
    }

    try {
        const raw = window.localStorage.getItem(getCacheKey(userId));
        if (!raw) {
            return null;
        }

        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") {
            return null;
        }

        return {
            workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
            progress: Array.isArray(parsed.progress) ? parsed.progress : [],
            meals: Array.isArray(parsed.meals) ? parsed.meals : [],
            goal: parsed.goal && typeof parsed.goal === "object" ? parsed.goal : null,
            posts: Array.isArray(parsed.posts) ? parsed.posts : [],
        };
    }
    catch (_error) {
        return null;
    }
};

const writeFitnessCache = (userId, payload) => {
    if (!userId || typeof window === "undefined") {
        return;
    }

    try {
        window.localStorage.setItem(getCacheKey(userId), JSON.stringify(payload));
    }
    catch (_error) {
    }
};

const toUiWorkout = (workout) => ({
    id: workout._id,
    name: workout.title,
    day: workout.category,
    date: new Date(workout.date).toISOString().slice(0, 10),
    completed: Boolean(workout.completed),
    notes: workout.notes || "",
    restSeconds: Number(workout.restSeconds || 60),
    exercises: (workout.exercises || []).map((exercise, index) => ({
        id: exercise._id || `${workout._id}-${index}`,
        name: exercise.name,
        category: exercise.category || "General",
        sets: exercise.sets || 0,
        reps: exercise.reps || 0,
        weight: exercise.weight || 0,
        restSeconds: exercise.restSeconds || 0,
        durationMinutes: exercise.durationMinutes || 0,
        notes: exercise.notes || "",
        setType: exercise.setType || "standard",
        groupId: exercise.groupId || "",
        videoUrl: exercise.videoUrl || "",
        steps: exercise.steps || [],
        requirements: exercise.requirements || [],
        formCue: exercise.formCue || "",
    })),
});

const toApiWorkout = (workout) => ({
    title: workout.name,
    category: workout.day,
    date: workout.date,
    completed: Boolean(workout.completed),
    notes: workout.notes || "",
    restSeconds: Number(workout.restSeconds || 60),
    exercises: (workout.exercises || []).map((exercise) => ({
        name: exercise.name,
        category: exercise.category || "General",
        sets: Number(exercise.sets || 0),
        reps: Number(exercise.reps || 0),
        weight: Number(exercise.weight || 0),
        restSeconds: Number(exercise.restSeconds || 0),
        durationMinutes: Number(exercise.durationMinutes || 0),
        notes: exercise.notes || "",
        setType: exercise.setType || "standard",
        groupId: exercise.groupId || "",
        videoUrl: exercise.videoUrl || "",
        steps: exercise.steps || [],
        requirements: exercise.requirements || [],
        formCue: exercise.formCue || "",
    })),
});

const toUiProgress = (entry) => {
    const bmi = entry.weight ? +(entry.weight / (1.75 * 1.75)).toFixed(1) : undefined;
    return {
        id: entry._id,
        date: new Date(entry.loggedAt || entry.createdAt).toISOString().slice(0, 10),
        weight: entry.weight,
        chest: entry.chest,
        waist: entry.waist,
        arms: entry.arms,
        bmi,
    };
};

const toUiMeal = (meal) => ({
    id: meal._id,
    name: meal.name,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    date: new Date(meal.date).toISOString().slice(0, 10),
    mealType: meal.mealType,
});

const toUiPost = (post) => ({
    id: post._id,
    userId: post.user?._id,
    userName: post.user?.isAnonymous === true ? "Anonymous" : (post.user?.name || "Anonymous"),
    title: post.title,
    content: post.content,
    imageUrl: post.imageUrl || "",
    imageUrls: Array.isArray(post.imageUrls) && post.imageUrls.length > 0 ? post.imageUrls : (post.imageUrl ? [post.imageUrl] : []),
    category: post.category || "General",
    likes: (post.likes || []).map((likeId) => likeId.toString()),
    comments: (post.comments || []).map((comment) => ({
        id: comment._id,
        userId: comment.user?._id,
        userName: comment.user?.isAnonymous === true ? "Anonymous" : (comment.user?.name || "Anonymous"),
        content: comment.content,
        date: comment.createdAt,
    })),
    date: post.createdAt,
});

export const FitnessProvider = ({ children }) => {
    const { user } = useAuth();
    const [workouts, setWorkouts] = useState([]);
    const [progress, setProgress] = useState([]);
    const [meals, setMeals] = useState([]);
    const [goal, setGoalState] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        let cancelled = false;

        const loadData = async () => {
            if (!user) {
                setWorkouts([]);
                setProgress([]);
                setMeals([]);
                setGoalState(null);
                setPosts([]);
                return;
            }

            const cached = readFitnessCache(user.id);
            if (cached) {
                setWorkouts(cached.workouts);
                setProgress(cached.progress);
                setMeals(cached.meals);
                setGoalState(cached.goal);
                setPosts(cached.posts);
            }

            const [workoutsRes, progressRes, mealsRes, goalRes, postsRes] = await Promise.all([
                apiRequest("/workouts"),
                apiRequest("/progress"),
                apiRequest("/diet/meals"),
                apiRequest("/diet/goal"),
                apiRequest("/community"),
            ]);

            if (cancelled) {
                return;
            }

            const nextWorkouts = (workoutsRes.data || []).map(toUiWorkout);
            const nextProgress = (progressRes.data || []).map(toUiProgress).reverse();
            const nextMeals = (mealsRes.data || []).map(toUiMeal);
            const nextGoal = goalRes.data ? {
                type: goalRes.data.type, 
                targetCalories: goalRes.data.targetCalories,
                trackingMode: goalRes.data.trackingMode || 'static'
            } : null;
            const nextPosts = (postsRes.data || []).map(toUiPost);

            setWorkouts(nextWorkouts);
            setProgress(nextProgress);
            setMeals(nextMeals);
            setGoalState(nextGoal);
            setPosts(nextPosts);

            writeFitnessCache(user.id, {
                workouts: nextWorkouts,
                progress: nextProgress,
                meals: nextMeals,
                goal: nextGoal,
                posts: nextPosts,
            });
        };

        loadData().catch(() => {
            // Keep existing/cached data on transient fetch failures.
        });

        return () => {
            cancelled = true;
        };
    }, [user]);

    useEffect(() => {
        if (!user) {
            return;
        }

        writeFitnessCache(user.id, {
            workouts,
            progress,
            meals,
            goal,
            posts,
        });
    }, [user, workouts, progress, meals, goal, posts]);

    const addWorkout = useCallback(async (workout) => {
        const res = await apiRequest("/workouts", {
            method: "POST",
            body: JSON.stringify(toApiWorkout(workout)),
        });
        const saved = toUiWorkout(res.data);
        setWorkouts((prev) => [...prev, saved]);
        return saved;
    }, []);

    const updateWorkout = useCallback(async (id, data) => {
        const current = workouts.find((workout) => workout.id === id);
        if (!current)
            return null;

        const res = await apiRequest(`/workouts/${id}`, {
            method: "PUT",
            body: JSON.stringify(toApiWorkout({ ...current, ...data })),
        });

        const updated = toUiWorkout(res.data);
        setWorkouts((prev) => prev.map((workout) => (workout.id === id ? updated : workout)));
        return updated;
    }, [workouts]);

    const deleteWorkout = useCallback(async (id) => {
        await apiRequest(`/workouts/${id}`, { method: "DELETE" });
        setWorkouts((prev) => prev.filter((workout) => workout.id !== id));
    }, []);

    const toggleWorkoutComplete = useCallback(async (id) => {
        const item = workouts.find((workout) => workout.id === id);
        if (!item)
            return;
        await updateWorkout(id, { completed: !item.completed });
    }, [updateWorkout, workouts]);

    const addProgress = useCallback(async (entry) => {
        const res = await apiRequest("/progress", {
            method: "POST",
            body: JSON.stringify({
                weight: entry.weight,
                chest: entry.chest,
                waist: entry.waist,
                arms: entry.arms,
                loggedAt: entry.date,
            }),
        });

        const saved = toUiProgress(res.data);
        setProgress((prev) => [...prev, saved]);
        return saved;
    }, []);

    const addMeal = useCallback(async (meal) => {
        const res = await apiRequest("/diet/meals", {
            method: "POST",
            body: JSON.stringify(meal),
        });
        const saved = toUiMeal(res.data);
        setMeals((prev) => [...prev, saved]);
        return saved;
    }, []);

    const setGoal = useCallback(async (nextGoal) => {
        const res = await apiRequest("/diet/goal", {
            method: "PUT",
            body: JSON.stringify(nextGoal),
        });

        const saved = { 
            type: res.data.type, 
            targetCalories: res.data.targetCalories,
            trackingMode: res.data.trackingMode || 'static'
        };
        setGoalState(saved);
        return saved;
    }, []);

    const addPost = useCallback(async (post) => {
        const res = await apiRequest("/community", {
            method: "POST",
            body: JSON.stringify(post),
        });

        const saved = toUiPost(res.data);
        setPosts((prev) => [saved, ...prev]);
        return saved;
    }, []);

    const likePost = useCallback(async (postId, _userId) => {
        const res = await apiRequest(`/community/${postId}/like`, { method: "POST" });
        const updated = toUiPost(res.data);
        setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
        return updated;
    }, []);

    const addComment = useCallback(async (postId, comment) => {
        const res = await apiRequest(`/community/${postId}/comments`, {
            method: "POST",
            body: JSON.stringify({ content: comment.content }),
        });
        const updated = toUiPost(res.data);
        setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
        return updated;
    }, []);

    const deletePost = useCallback(async (id) => {
        await apiRequest(`/community/${id}`, { method: "DELETE" });
        setPosts((prev) => prev.filter((post) => post.id !== id));
    }, []);

    const updatePost = useCallback(async (id, data) => {
        const res = await apiRequest(`/community/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
        });

        const updated = toUiPost(res.data);
        setPosts((prev) => prev.map((post) => (post.id === id ? updated : post)));
        return updated;
    }, []);

    return (<FitnessContext.Provider value={{
        workouts, addWorkout, updateWorkout, deleteWorkout, toggleWorkoutComplete,
        progress, addProgress,
        meals, addMeal,
        goal, setGoal,
        posts, addPost, likePost, addComment, deletePost, updatePost,
    }}>
        {children}
    </FitnessContext.Provider>);
};
