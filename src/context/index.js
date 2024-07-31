"use client"
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useRef,
    useCallback,
} from "react";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    arrayUnion,
    getDocs,
    collection,
} from "firebase/firestore";
import { db } from "../config/firebase"; // Adjust the path as needed

export const UserContext = createContext({});

export const useUser = () => useContext(UserContext);

export const ContextProvider = ({ children }) => {
    const [showTaskDialog, setShowTaskDialog] = useState(false);
    const [balance, setBalance] = useState(0);
    const [tapBalance, setTapBalance] = useState(0);
    const [level, setLevel] = useState({
        id: 1,
        name: "Bronze",
        imgUrl: "/bronze.webp",
    });
    const [tapValue, setTapValue] = useState({ level: 1, value: 1 });
    const [timeRefill, setTimeRefill] = useState({
        level: 1,
        duration: 10,
        step: 600,
    });
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(true);
    const [energy, setEnergy] = useState(500);
    const [battery, setBattery] = useState({ level: 1, energy: 500 });
    const [initialized, setInitialized] = useState(false);
    const [refBonus, setRefBonus] = useState(0);
    const [manualTasks, setManualTasks] = useState([]);
    const [userManualTasks, setUserManualTasks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [claimedMilestones, setClaimedMilestones] = useState([]);
    const [claimedReferralRewards, setClaimedReferralRewards] = useState([]);
    const [referrals, setReferrals] = useState([]);
    const [telegramUser, setTelegram] = useState()
    const [refiller, setRefiller] = useState(0);
    const [count, setCount] = useState(0);
    const [tapGuru, setTapGuru] = useState(false);
    const [mainTap, setMainTap] = useState(true);
    const [time, setTime] = useState(22);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [freeGuru, setFreeGuru] = useState(3);
    const [fullTank, setFullTank] = useState(3);
    const [timeSta, setTimeSta] = useState(null);
    const [timeStaTank, setTimeStaTank] = useState(null);
    const [username, setUsername] = useState("");
    const [idme, setIdme] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [dividedCount, setDividedCount] = useState(0);
    const [users, setUsers] = useState(0);
    const [dividedUsers, setDividedUsers] = useState(0);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [taskCompleted2, setTaskCompleted2] = useState(false);

    const accumulatedEnergyRef = useRef(energy);
    const [isRefilling, setIsRefilling] = useState(false);
    const refillDuration = timeRefill.duration * 60 * 1000;
    const refillSteps = timeRefill.step;
    const incrementValue = refiller / refillSteps;
    const defaultEnergy = refiller;



    useEffect(() => {
        if (window) {

            setTelegram(window?.Telegram?.WebApp?.initDataUnsafe?.user)
        }
    }, [])


    useEffect(() => {
        let timerId;
        if (isTimerRunning && time > 0) {
            timerId = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            setTapGuru(false);
            setMainTap(true);
        }
        return () => clearInterval(timerId);
    }, [isTimerRunning, time]);

    const startTimer = useCallback(() => {
        setTime(22);
        setTapGuru(true);
        setIsTimerRunning(true);
    }, []);

    const sendUserData = async () => {
        const queryParams = new URLSearchParams(window.location.search);
        let referrerId = queryParams.get("ref");
        if (referrerId) {
            referrerId = referrerId.replace(/\D/g, "");
        }

        if (telegramUser) {
            const {
                id: userId,
                username,
                first_name: firstName,
                last_name: lastName,
            } = telegramUser;

            const finalUsername = username || `${firstName}_${userId}`;
            console.log(telegramUser, "runn");
            try {
                const userRef = doc(db, "telegramUsers", userId.toString());
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    console.log("User already exists in Firestore");
                    const userData = userDoc.data();
                    setBalance(userData.balance);
                    setTapBalance(userData.tapBalance);
                    setTapValue(userData.tapValue);
                    setFreeGuru(userData.freeGuru);
                    setFullTank(userData.fullTank);
                    setTimeSta(userData.timeSta);
                    setTimeStaTank(userData.timeStaTank);
                    setClaimedMilestones(userData.claimedMilestones || []);
                    setClaimedReferralRewards(userData.claimedReferralRewards || []);
                    setBattery(userData.battery);
                    setRefiller(userData.battery.energy);
                    setTimeRefill(userData.timeRefill);
                    setLevel(userData.level);
                    setId(userData.userId);
                    setRefBonus(userData.refBonus || 0);
                    await updateReferrals(userRef);
                    setInitialized(true);
                    setLoading(false);
                    fetchData(userData.userId);
                    return;
                }

                const userData = {
                    userId: userId.toString(),
                    username: finalUsername,
                    firstName,
                    lastName,
                    totalBalance: 0,
                    balance: 0,
                    freeGuru: 3,
                    fullTank: 3,
                    tapBalance: 0,
                    timeSta: null,
                    timeStaTank: null,
                    tapValue: { level: 1, value: 1 },
                    timeRefill: { level: 1, duration: 10, step: 600 },
                    level: { id: 1, name: "Bronze", imgUrl: "/bronze.webp" },
                    energy: 500,
                    battery: { level: 1, energy: 500 },
                    refereeId: referrerId || null,
                    referrals: [],
                };

                await setDoc(userRef, userData);
                setBalance(userData.balance);
                setTapBalance(userData.tapBalance);
                setTapValue(userData.tapValue);
                setFreeGuru(userData.freeGuru);
                setFullTank(userData.fullTank);
                setTimeSta(userData.timeSta);
                setTimeStaTank(userData.timeStaTank);
                setClaimedMilestones(userData.claimedMilestones || []);
                setClaimedReferralRewards(userData.claimedReferralRewards || []);
                setBattery(userData.battery);
                setRefiller(userData.battery.energy);
                setTimeRefill(userData.timeRefill);
                setLevel(userData.level);
                setId(userData.userId);
                setRefBonus(userData.refBonus || 0);
                await updateReferrals(userRef);
                setInitialized(true);
                setLoading(false);
                fetchData(userData.userId);


                if (referrerId) {
                    const referrerRef = doc(db, "telegramUsers", referrerId);
                    const referrerDoc = await getDoc(referrerRef);
                    if (referrerDoc.exists()) {
                        await updateDoc(referrerRef, {
                            referrals: arrayUnion({
                                userId: userId.toString(),
                                username: finalUsername,
                                balance: 0,
                                level: {
                                    id: 1,
                                    name: "Bronze",
                                    imgUrl: "/bronze.webp",
                                },
                            }),
                        });
                        console.log("Referrer updated in Firestore");
                    }
                }

                setInitialized(true);
                setLoading(false);
                fetchData(userId.toString());
            } catch (error) {
                console.error("Error saving user in Firestore:", error);
            }
        }
    };

    const updateReferrals = async (userRef) => {
        try {
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setReferrals(userData.referrals || []);
                console.log("Referrals updated");
            }
        } catch (error) {
            console.error("Error updating referrals:", error);
        }
    };

    const fetchData = async (userId) => {
        try {
            const tasksSnapshot = await getDocs(collection(db, "tasks"));
            const fetchedTasks = tasksSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTasks(fetchedTasks);

            const manualTasksSnapshot = await getDocs(collection(db, "manualTasks"));
            const fetchedManualTasks = manualTasksSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setManualTasks(fetchedManualTasks);

            const userTasksSnapshot = await getDocs(
                collection(db, "telegramUsers", userId, "tasks")
            );
            const fetchedUserTasks = userTasksSnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUserManualTasks(fetchedUserTasks);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const value = {
        showTaskDialog,
        setShowTaskDialog,
        balance,
        setBalance,
        tapBalance,
        setTapBalance,
        level,
        setLevel,
        tapValue,
        setTapValue,
        timeRefill,
        setTimeRefill,
        id,
        setId,
        loading,
        setLoading,
        energy,
        setEnergy,
        battery,
        setBattery,
        initialized,
        setInitialized,
        refBonus,
        setRefBonus,
        manualTasks,
        setManualTasks,
        userManualTasks,
        setUserManualTasks,
        tasks,
        setTasks,
        completedTasks,
        setCompletedTasks,
        claimedMilestones,
        setClaimedMilestones,
        claimedReferralRewards,
        setClaimedReferralRewards,
        referrals,
        setReferrals,
        telegramUser,
        refiller,
        setRefiller,
        count,
        setCount,
        tapGuru,
        setTapGuru,
        mainTap,
        setMainTap,
        time,
        setTime,
        isTimerRunning,
        setIsTimerRunning,
        freeGuru,
        setFreeGuru,
        fullTank,
        setFullTank,
        timeSta,
        setTimeSta,
        timeStaTank,
        setTimeStaTank,
        username,
        setUsername,
        idme,
        setIdme,
        totalCount,
        setTotalCount,
        dividedCount,
        setDividedCount,
        users,
        setUsers,
        dividedUsers,
        setDividedUsers,
        taskCompleted,
        setTaskCompleted,
        taskCompleted2,
        setTaskCompleted2,
        startTimer,
        sendUserData,
    };


    useEffect(() => {
        sendUserData();
    }, [telegramUser]);


    return <UserContext.Provider value={value}>

        {children}
    </UserContext.Provider>;
};
