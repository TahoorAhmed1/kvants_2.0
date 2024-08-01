import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebase'; // Adjust the path as needed




const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const tele = window.Telegram.WebApp;
    tele.disableVerticalSwipes();
    const [balance, setBalance] = useState(0);
    // const [totalBalance, setTotalBalance] = useState(0);
    const [tapBalance, setTapBalance] = useState(0);
    const [level, setLevel] = useState({ id: 1, name: "Bronze", imgUrl: '/bronze.webp' }); // Initial level as an object with id and name
    const [tapValue, setTapValue] = useState({ level: 1, value: 1 });
    const [timeRefill, setTimeRefill] = useState({ level: 1, duration: 10, step: 600 });
    const [id, setId] = useState("");
    const [loading, setLoading] = useState(true);
    const [energy, setEnergy] = useState(500);
    const [battery, setBattery] = useState({ level: 1, energy: 500 });
    const [initialized, setInitialized] = useState(false);
    const [refBonus, SetRefBonus] = useState(0);
    const [manualTasks, setManualTasks] = useState([]);
    const [userManualTasks, setUserManualTasks] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]); // State to hold completed tasks
    const [claimedMilestones, setClaimedMilestones] = useState([]);
    const [claimedReferralRewards, setClaimedReferralRewards] = useState([]);
    const [referrals, setReferrals] = useState([]); // State to hold referrals
    const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
    const [refiller, setRefiller] = useState(0);
    const { count, setCount } = useState(0);
    const [tapGuru, setTapGuru] = useState(false);
    const [mainTap, setMainTap] = useState(true);
    const [time, setTime] = useState(22);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [freeGuru, setFreeGuru] = useState(3);
    const [fullTank, setFullTank] = useState(3);
    const [timeSta, setTimeSta] = useState(null);
    const [timeStaTank, setTimeStaTank] = useState(null);
    const [username, setUsername] = useState("");
    // eslint-disable-next-line
    const [daily_claimed, setDaily_claimed] = useState("");
    const [idme, setIdme] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [dividedCount, setDividedCount] = useState(0);
    const [users, setUsers] = useState(0);
    const [dividedUsers, setDividedUsers] = useState(0);
    const [taskCompleted, setTaskCompleted] = useState(false);
    const [taskCompleted2, setTaskCompleted2] = useState(false);
    const [isUserExist, setIsUserExist] = useState(false)
    const refillIntervalRef = useRef(null);
    const [isRefilling, setIsRefilling] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [task, setTask] = useState([])

    const accumulatedEnergyRef = useRef(energy);

    const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

    const refillDuration = 1000; // 1 second in milliseconds
    const incrementValue = 1; // Increment by 1 each step
    const defaultEnergy = 0; // 







    useEffect(() => {
        let timerId;
        if (isTimerRunning && time > 0) {
            timerId = setInterval(() => {
                setTime(prevTime => prevTime - 1);
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
        console.log("userData");
        const queryParams = new URLSearchParams(window.location.search);
        console.log(window.location, "window_location");
        console.log(queryParams, "ref");
        let referrerId = queryParams.get("ref");
        console.log(referrerId);
        if (referrerId) {
            referrerId = referrerId.replace(/\D/g, "");
        }

        if (telegramUser) {
            const { id: userId, username, first_name: firstName, last_name: lastName } = telegramUser;

            // Use first name and ID as username if no Telegram username exists
            const finalUsername = username || `${firstName}_${lastName}`;

            try {
                const userRef = doc(db, 'telegramUsers', userId.toString());
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setIsUserExist(true)
                    console.log('User already exists in Firestore');
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
                    setTask(userData.task_lists || []);
                    setUsername(userData.username);
                    setBattery(userData.battery);
                    setRefiller(userData.battery.energy);
                    setTimeRefill(userData.timeRefill);
                    setDaily_claimed(userData.daily_claimed)
                    setLevel(userData.level);
                    setId(userData.userId);
                    SetRefBonus(userData.refBonus || 0);
                    setCurrentIndex(userData.youtube_booster.currentIndex)
                    await updateReferrals(userRef);
                    setInitialized(true);
                    setLoading(false);
                    fetchData(userData.userId); // Fetch data for the existing user
                    console.log("Battery is:", userData.battery.energy)
                    return;
                }
                setIsUserExist(false)

                const userData = referrerId ? {
                    userId: userId.toString(),
                    username: finalUsername,
                    firstName,
                    lastName,
                    totalBalance: 0,
                    balance: 10000,
                    freeGuru: 3,
                    fullTank: 3,
                    tapBalance: 0,
                    timeSta: null,
                    timeStaTank: null,
                    daily_claimed: {
                        day: 0,
                        date: "",
                        reward: 0
                    },
                    claimedReferralRewards: [],
                    tapValue: { level: 0, value: 1 },
                    timeRefill: { level: 1, duration: 10, step: 600 },
                    level: { id: 1, name: "Bronze", imgUrl: '/bronze.webp' }, // Set the initial level with id and name
                    energy: 500,
                    battery: { level: 1, energy: 500 },
                    refereeId: referrerId || null,
                    referrals: [],
                    task_lists: [],
                    youtube_booster: {
                        date: "",
                        startAt: "",
                        status: false,
                        currentIndex: 0,
                        videoWatch: 0
                    }
                } : {
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
                    daily_claimed: {
                        day: 0,
                        date: "",
                        reward: 0
                    },
                    claimedReferralRewards: [],
                    tapValue: { level: 0, value: 1 },
                    timeRefill: { level: 1, duration: 10, step: 600 },
                    level: { id: 1, name: "Bronze", imgUrl: '/bronze.webp' }, // Set the initial level with id and name
                    energy: 500,
                    battery: { level: 0, energy: 500 },
                    refereeId: referrerId || null,
                    referrals: [],
                    task_lists: [],
                    youtube_booster: {
                        date: "",
                        startAt: "",
                        status: false,
                        currentIndex: 0,
                        videoWatch: 0
                    }
                };
                await setDoc(userRef, userData);
                setEnergy(500);
                setBalance(userData.balance);
                setTapBalance(userData.tapBalance);
                setTapValue(userData.tapValue);
                setFreeGuru(userData.freeGuru);
                setFullTank(userData.fullTank);
                setTimeSta(userData.timeSta);
                setTimeStaTank(userData.timeStaTank);
                setClaimedMilestones(userData.claimedMilestones || []);
                setClaimedReferralRewards(userData.claimedReferralRewards || []);
                setTask(userData.task_lists || []);
                setUsername(userData.username);
                setBattery(userData.battery);
                setRefiller(userData.battery.energy);
                setTimeRefill(userData.timeRefill);
                setDaily_claimed(userData.daily_claimed)
                setLevel(userData.level);
                setId(userData.userId);
                SetRefBonus(userData.refBonus || 0);
                setInitialized(true);
                setLoading(false);
                fetchData(userData.userId);
                setCurrentIndex(userData.youtube_booster.currentIndex)


                if (referrerId) {
                    const referrerRef = doc(db, 'telegramUsers', referrerId);
                    const referrerDoc = await getDoc(referrerRef);


                    if (referrerDoc.exists()) {

                        await updateDoc(referrerRef, {

                            referrals: arrayUnion({
                                userId: userId.toString(),
                                username: finalUsername,
                                balance: 0,
                                level: { id: 1, name: "Bronze", imgUrl: '/bronze.webp' }, // Include level with id and name
                            })
                        });
                        console.log('Referrer updated in Firestore');
                    }
                }

                setInitialized(true);
                setLoading(false);
                fetchData(userId.toString()); // Fetch data for the new user

            } catch (error) {
                console.error('Error saving user in Firestore:', error);
            }
        }
    };


    // const fetchStartTimeTap = async () => {

    //   // const userRef = doc(db, "telegramUsers", "7326264229");
    //   const userRef = doc(db, 'telegramUsers', id.toString());


    //   console.log("timer true")
    //   const userDoc = await getDoc(userRef);
    //   if (userDoc.exists()) {
    //     const data = userDoc.data();
    //     if (data?.youtube_booster?.date) {
    //       const startTime = data.youtube_booster.date.toDate();
    //       const currentTime = Date.now();
    //       const timePassed = currentTime - startTime;
    //       const oneHourInMillis = 1 * 60 * 60 * 1000;

    //       if (timePassed >= oneHourInMillis) {
    //         setStartTapTime(false);
    //         console.log("timer false")
    //       } else {
    //         const remainingTime = oneHourInMillis - timePassed;
    //         setTapTimer(Math.floor(remainingTime / 1000)); // Convert to seconds
    //         setStartTapTime(true);
    //         console.log("timer true")
    //       }
    //     }
    //   }
    // };



    // useEffect(() => {
    //   fetchStartTimeTap()
    // }, [])





    const updateReferrals = async (userRef) => {
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();
        const referrals = userData.referrals || [];

        const updatedReferrals = await Promise.all(referrals.map(async (referral) => {
            const referralRef = doc(db, 'telegramUsers', referral.userId);
            const referralDoc = await getDoc(referralRef);
            if (referralDoc.exists()) {
                const referralData = referralDoc.data();
                return {
                    ...referral,
                    balance: referralData.balance,
                    level: referralData.level,
                };
            }
            return referral;
        }));

        await updateDoc(userRef, {
            referrals: updatedReferrals,
        });

        const totalEarnings = updatedReferrals.reduce((acc, curr) => acc + curr.balance, 0);
        const refBonus = Math.floor(totalEarnings * 0.1);
        const totalBalance = `${balance}` + refBonus;
        console.log(`Total earnings: ${totalEarnings}, Referrer bonus: ${refBonus}`);

        // Save the refBonus to the user's document
        try {
            await updateDoc(userRef, { refBonus, totalBalance });
            console.log('Referrer bonus updated in Firestore');
            console.log('Your balance is:', `${balance}`);
        } catch (error) {
            console.error('Error updating referrer bonus:', error);
        }
    };

    const claim_friends_award = async () => {
        const userRef = doc(db, 'telegramUsers', '1529198067');
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log(userData);

        }
    }

    const fetchData = async (userId) => {
        if (!userId) return; // Ensure userId is set
        try {
            // Fetch tasks
            const tasksQuerySnapshot = await getDocs(collection(db, 'tasks'));
            const tasksData = tasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(tasksData);

            // Fetch user data
            const userDocRef = doc(db, 'telegramUsers', userId);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                setCompletedTasks(userData.tasksCompleted || []);
                setUserManualTasks(userData.manualTasks || []);
            }

            // Fetch manual tasks
            const manualTasksQuerySnapshot = await getDocs(collection(db, 'manualTasks'));
            const manualTasksData = manualTasksQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setManualTasks(manualTasksData);

        } catch (error) {
            console.error("Error fetching data: ", error);
        }
    };

    const fetchReferrals = async () => {
        const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
        if (telegramUser) {
            const { id: userId } = telegramUser;
            const userRef = doc(db, 'telegramUsers', userId.toString());
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                const userData = userDoc.data();
                setReferrals(userData.referrals || []);
            }
            setLoading(false);
        }
    };

    const updateUserLevel = async (userId, newTapBalance) => {
        let newLevel = { id: 1, name: "Bronze", imgUrl: "/bronze.webp" };

        if (newTapBalance >= 1000 && newTapBalance < 50000) {
            newLevel = { id: 2, name: "Silver", imgUrl: "/sliver.webp" };
        } else if (newTapBalance >= 50000 && newTapBalance < 500000) {
            newLevel = { id: 3, name: "Gold", imgUrl: "/gold.webp" };
        } else if (newTapBalance >= 500000 && newTapBalance < 1000000) {
            newLevel = { id: 4, name: "Platinum", imgUrl: "/platinum.webp" };
        } else if (newTapBalance >= 1000000 && newTapBalance < 2500000) {
            newLevel = { id: 5, name: "Diamond", imgUrl: "/diamond.webp" };
        } else if (newTapBalance >= 2500000) {
            newLevel = { id: 6, name: "Master", imgUrl: "/master.webp" };
        }

        if (newLevel.id !== level.id) {
            setLevel(newLevel);
            const userRef = doc(db, 'telegramUsers', userId);
            await updateDoc(userRef, { level: newLevel });
            console.log(`User level updated to ${newLevel.name}`);
        }
    };





    useEffect(() => {
        sendUserData();
        // eslint-disable-next-line
    }, []);



    const checkAndUpdateFreeGuru = async () => {
        const userRef = doc(db, 'telegramUsers', id.toString());
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const lastDate = userData.timeSta.toDate(); // Convert Firestore timestamp to JS Date
            const formattedDates = lastDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
            const currentDate = new Date(); // Get the current date
            const formattedCurrentDates = currentDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
            // const timeDifference = (currentTime - lastTimeSta) / 1000; // Time difference in seconds
            // console.log('timesta is:', lastDate)
            // console.log('current time is:', currentDate)
            // console.log('time difference is:', timeDifference)

            if (formattedDates !== formattedCurrentDates && userData.freeGuru <= 0) {
                await updateDoc(userRef, {
                    freeGuru: 3,
                    timeSta: new Date()

                });
                setFreeGuru(3);
            }
        }
    };

    const checkAndUpdateFullTank = async () => {
        const userRef = doc(db, 'telegramUsers', id.toString());
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            const lastDateTank = userData.timeStaTank.toDate(); // Convert Firestore timestamp to JS Date
            const formattedDate = lastDateTank.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format
            const currentDate = new Date(); // Get the current date
            const formattedCurrentDate = currentDate.toISOString().split('T')[0]; // Get the date part in YYYY-MM-DD format

            // const timeDifference = (currentTime - lastTimeSta) / 1000; // Time difference in seconds
            console.log('timesta is:', lastDateTank)
            console.log('formated timesta is:', formattedDate)
            console.log('current time is:', currentDate)
            console.log('formatted current time is:', formattedCurrentDate)
            // console.log('time difference is:', timeDifference)

            if (formattedDate !== formattedCurrentDate && userData.fullTank <= 0) {
                await updateDoc(userRef, {
                    fullTank: 3,
                    timeStaTank: new Date()

                });
                setFullTank(3);
            }
        }
    };

    useEffect(() => {
        // Fetch the remaining clicks from Firestore when the component mounts
        const fetchRemainingClicks = async () => {
            if (id) {
                const userRef = doc(db, 'telegramUsers', id.toString());
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setFreeGuru(userData.freeGuru || 0);
                    setFullTank(userData.fullTank || 0);
                }
            }
        };

        fetchRemainingClicks();
    }, [id]);


    useEffect(() => {
        const telegramUsername =
            window.Telegram.WebApp.initDataUnsafe?.user?.username;
        const telegramUserid = window.Telegram.WebApp.initDataUnsafe?.user?.id;

        if (telegramUsername) {
            setUsername(telegramUsername);
        }
        if (telegramUserid) {
            setIdme(telegramUserid);
        }

        // Fetch total count from Firestore
        fetchTotalCountFromFirestore().then((totalCount) => {
            setTotalCount(totalCount);
            const divided = calculateDividedCount(totalCount);
            setDividedCount(divided);
        });

        fetchAllUsers(); // Fetch all users when the component mounts
    }, []);

    const fetchTotalCountFromFirestore = async () => {
        try {
            const userRef = collection(db, "telegramUsers");
            const querySnapshot = await getDocs(userRef);
            let totalCount = 0;
            querySnapshot.forEach((doc) => {
                totalCount += doc.data().balance;
            });
            return totalCount;
        } catch (e) {
            console.error("Error fetching documents: ", e);
            return 0;
        }
    };

    const fetchAllUsers = async () => {
        try {
            const userRef = collection(db, "telegramUsers");
            const querySnapshot = await getDocs(userRef);
            const allUsers = [];
            const uniqueUsernames = new Set(); // Using a Set to store unique usernames

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const username = data.username;
                const firstName = data.firstName;
                const refereeId = data.refereeId;
                const balance = data.balance;

                // Check if the username is unique, if yes, add it to the allUsers array and set
                // a flag indicating that it has been added
                if (!uniqueUsernames.has(username)) {
                    allUsers.push({ username, firstName, refereeId, balance });
                    uniqueUsernames.add(username);
                }
            });

            setUsers(allUsers.length);
            setDividedUsers(allUsers.length / 2);
            setLoading(false); // Set loading to false once data is fetched
            // Update the count of unique users
        } catch (error) {
            console.error("Error fetching users: ", error);
            setLoading(false); // Set loading to false if there's an error
        }
    };

    const calculateDividedCount = (count) => {
        return count / 4;
    };


    // Call this function when appropriate, such as on component mount or before handleClick
    useEffect(() => {
        if (id) {
            checkAndUpdateFreeGuru();
            checkAndUpdateFullTank();
        }
        // eslint-disable-next-line
    }, [id]);




    useEffect(() => {
        if (id) {
            updateUserLevel(id, tapBalance);

        }
        // eslint-disable-next-line
    }, [tapBalance, id]);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);


    useEffect(() => {
        fetchReferrals();

    }, []);

    return (
        <UserContext.Provider value={{
            task, setTask,
            daily_claimed, isUserExist, balance, battery, freeGuru, fullTank, fetchData, taskCompleted, setTaskCompleted, taskCompleted2, setTaskCompleted2, currentIndex,
            setCurrentIndex, setFullTank, timeStaTank, setTimeStaTank, timeSta, setFreeGuru, time, setTime, startTimer, tapGuru, setTapGuru, mainTap, setMainTap, timeRefill, setTimeRefill, refiller, setRefiller, count, setCount, isRefilling, setIsRefilling, refillIntervalRef, setBattery, tapValue, setTapValue, tapBalance, setTapBalance, level, energy, setEnergy, setBalance, setLevel, loading, setLoading, id, setId, sendUserData, initialized, setInitialized, refBonus, SetRefBonus, manualTasks, setManualTasks, userManualTasks, setUserManualTasks, tasks, setTasks, completedTasks, setCompletedTasks, claimedMilestones, setClaimedMilestones, referrals, claimedReferralRewards, setClaimedReferralRewards, idme, setIdme, totalCount, setTotalCount, dividedCount, setDividedCount, users, setUsers, dividedUsers, setDividedUsers, username, setUsername, claim_friends_award, accumulatedEnergyRef
        }}>
            {children}
        </UserContext.Provider>
    );
};
