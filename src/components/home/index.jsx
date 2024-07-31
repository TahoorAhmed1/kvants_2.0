import { useEffect, useRef, useState } from "react";

import { doc, updateDoc } from "@firebase/firestore";
import { db } from "../../config/firebase";
import { useUser } from "../../context";
import {
  add,
  flash,
  kvaiCoin,
  paperPlane,
  robot,
  shadow,
  star,
} from "../../assets";
import Footer from "../common/footer";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import Header from "../common/header";

const tele = window.Telegram.WebApp;
tele.disableVerticalSwipes();

const slideUp = keyframes`
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-350px);
  }
`;

const SlideUpText = styled.div`
  position: absolute;
  animation: ${slideUp} 3s ease-out;
  font-size: 2.1em;
  color: #ffffffa6;
  font-weight: 600;
  left: ${({ x }) => x}px;
  top: ${({ y }) => y}px;
  pointer-events: none; /* To prevent any interaction */
  z-index: 2;
`;

const Container = styled.div`
  position: relative;
  display: inline-block;
  text-align: center;
  width: 100%;
  height: 100%;
`;

const Home = () => {
  const imgRef = useRef(null);
  const [clicks, setClicks] = useState([]);
  const {
    balance,
    tapBalance,
    energy,
    battery,
    refiller,

    setEnergy,
    tapValue,
    setTapBalance,
    setBalance,
    refBonus,
    telegramUser,

    sendUserData,
    id,
  } = useUser();
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    window?.Telegram?.WebApp?.expand();

    window?.Telegram?.WebApp?.ready();

    window?.Telegram?.WebApp.setHeaderColor("#191b33");

    if (window?.Telegram?.WebApp?.HapticFeedback) {
      window?.Telegram?.WebApp.HapticFeedback.impactOccurred("medium");
    }
  }, []);
  const [isRefilling, setIsRefilling] = useState(false);
  const [points, setPoints] = useState(0);
  const [glowBooster, setGlowBooster] = useState(false);

  const debounceTimerRef = useRef(null);
  const isUpdatingRef = useRef(false);
  const accumulatedBalanceRef = useRef(balance);
  const accumulatedEnergyRef = useRef(500);
  const accumulatedTapBalanceRef = useRef(tapBalance);
  const refillTimeoutRef = useRef(null);
  const refillDuration = 800; // 1 second in milliseconds
  const incrementValue = 1; // Increment by 1 each step
  const defaultEnergy = 0; //
  const refillIntervalRef = useRef(null);

  const startRefillInterval = () => {
    if (refillIntervalRef.current) {
      clearInterval(refillIntervalRef.current);
    }
    refillIntervalRef.current = setInterval(() => {
      setEnergy((prevEnergy) => {
        if (isNaN(prevEnergy) || prevEnergy >= refiller) {
          clearInterval(refillIntervalRef.current);
          setIsRefilling(false);
          return refiller;
        }
        const newEnergy = Math.min(prevEnergy + incrementValue, refiller); // Ensure energy doesn't exceed max
        if (!isNaN(newEnergy)) {
          accumulatedEnergyRef.current = newEnergy;
          localStorage.setItem("energy", newEnergy); // Save updated energy to local storage
          localStorage.setItem("lastRefillTime", Date.now()); // Save the current time
          console.log("Energy saved to local storage:", newEnergy); // Log the energy value saved to local storage
        }
        return newEnergy;
      });
    }, refillDuration); // Increase energy every second
  };

  const refillEnergy = () => {
    setIsRefilling(true);
    startRefillInterval();
  };

  useEffect(() => {
    if (energy < refiller && !isRefilling) {
      refillEnergy();
    }
    // eslint-disable-next-line
  }, [energy, isRefilling]);

  useEffect(() => {
    if (id) {
      if (refillIntervalRef.current) {
        clearInterval(refillIntervalRef.current);
      }

      const storedEnergy = localStorage.getItem("energy");
      const lastRefillTime = localStorage.getItem("lastRefillTime");
      let energyValue = defaultEnergy;
      let lastTime = Date.now();

      if (storedEnergy && lastRefillTime) {
        energyValue = Number(storedEnergy);
        lastTime = Number(lastRefillTime);

        if (
          !isNaN(energyValue) &&
          energyValue >= 0 &&
          !isNaN(lastTime) &&
          lastTime > 0
        ) {
          const elapsedTime = Date.now() - lastTime;
          const elapsedSteps = Math.floor(elapsedTime / refillDuration);
          const restoredEnergy = Math.min(
            energyValue + elapsedSteps * incrementValue,
            refiller
          );

          if (!isNaN(restoredEnergy) && restoredEnergy >= 0) {
            setEnergy(restoredEnergy);
            if (restoredEnergy < refiller) {
              setIsRefilling(true);
              refillEnergy();
            }
          } else {
            setEnergy(defaultEnergy);
          }
        } else {
          setEnergy(defaultEnergy);
        }
      } else if (storedEnergy) {
        energyValue = Number(storedEnergy);
        if (!isNaN(energyValue) && energyValue >= 0) {
          setEnergy(energyValue);
        } else {
          setEnergy(defaultEnergy);
        }
      } else {
        setEnergy(defaultEnergy);
      }

      localStorage.setItem("energy", energyValue);
      localStorage.setItem("lastRefillTime", lastTime);
    }
    // eslint-disable-next-line
  }, [id]);

  const handleClick = (e) => {
    e.preventDefault();

    if (energy == 0) {
      return;
    }

    triggerHapticFeedback();

    if (energy <= 0 || isDisabled || isUpdatingRef.current) {
      setGlowBooster(true); // Trigger glow effect if energy and points are 0
      setTimeout(() => {
        setGlowBooster(false); // Remove glow effect after 1 second
      }, 300);
      return; // Exit if no energy left or if clicks are disabled or if an update is in progress
    }

    const { offsetX, offsetY, target } = e.nativeEvent;
    const { clientWidth, clientHeight } = target;

    const horizontalMidpoint = clientWidth / 2;
    const verticalMidpoint = clientHeight / 2;

    const animationClass =
      offsetX < horizontalMidpoint
        ? "wobble-left"
        : offsetX > horizontalMidpoint
        ? "wobble-right"
        : offsetY < verticalMidpoint
        ? "wobble-top"
        : "wobble-bottom";

    // Remove previous animations
    imgRef.current.classList.remove(
      "wobble-top",
      "wobble-bottom",
      "wobble-left",
      "wobble-right"
    );

    // Add the new animation class
    imgRef.current.classList.add(animationClass);

    // Remove the animation class after animation ends to allow re-animation on the same side
    setTimeout(() => {
      imgRef.current.classList.remove(animationClass);
    }, 300); // duration should match the animation duration in CSS

    // Increment the count
    const rect = e.target.getBoundingClientRect();
    const newClick = {
      id: Date.now(), // Unique identifier
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    setClicks((prevClicks) => [...prevClicks, newClick]);

    // Update state immediately for UI
    setEnergy((prevEnergy) => {
      const newEnergy = Math.max(prevEnergy - tapValue.value, 0); // Ensure energy does not drop below zero
      accumulatedEnergyRef.current = newEnergy;
      return newEnergy;
    });

    setPoints((prevPoints) => prevPoints + 1);

    setBalance((prevBalance) => {
      const newBalance = prevBalance + tapValue.value;
      accumulatedBalanceRef.current = newBalance;
      return newBalance;
    });

    setTapBalance((prevTapBalance) => {
      const newTapBalance = prevTapBalance + 1;
      accumulatedTapBalanceRef.current = newTapBalance;
      return newTapBalance;
    });

    // Remove the click after the animation duration
    setTimeout(() => {
      setClicks((prevClicks) =>
        prevClicks.filter((click) => click.id !== newClick.id)
      );
    }, 800); // Match this duration with the animation duration

    // Reset the debounce timer
    clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(updateFirestore, 200); // Adjust the delay as needed
    // Adjust the delay as needed

    // Reset the refill time
    clearInterval(refillIntervalRef.current); // Stop refilling while the user is active
    setIsRefilling(false); // Set refilling state to false
    clearTimeout(refillTimeoutRef.current);
    refillTimeoutRef.current = setTimeout(() => {
      if (energy < battery.energy) {
        refillEnergy();
      }
    }, 10); // Set the inactivity period to 3 seconds (adjust as needed)
  };

  function triggerHapticFeedback() {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (
      isIOS &&
      window.Telegram &&
      window.Telegram.WebApp &&
      window.Telegram.WebApp.HapticFeedback
    ) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred("medium");
    } else if (isAndroid && "vibrate" in navigator) {
      navigator.vibrate(50); // Vibrate for 50ms
    } else {
      console.warn("Haptic feedback not supported on this device.");
    }
  }

  useEffect(() => {
    let startY = 0;

    const handleTouchStart = (e) => {
      startY = e.touches[0].clientY;
    };

    const handleTouchMove = (e) => {
      const endY = e.touches[0].clientY;
      const distance = endY - startY;

      if (distance > 30) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  useEffect(() => {
    const handleContextMenu = (event) => event.preventDefault();
    const handleKeyDown = (event) => {
      if (
        (event.ctrlKey && (event.key === "u" || event.key === "s")) ||
        (event.ctrlKey && event.shiftKey && event.key === "i")
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  useEffect(() => {
    return () => {
      clearTimeout(debounceTimerRef.current);
      clearTimeout(refillTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(debounceTimerRef.current);
      clearTimeout(refillTimeoutRef.current);
    };
  }, []);
  useEffect(() => {
    return () => {
      clearTimeout(debounceTimerRef.current);
      clearInterval(refillIntervalRef?.current);
      clearTimeout(refillTimeoutRef.current);
    };
  }, []);

  const updateFirestore = async () => {
    const telegramUser = window.Telegram.WebApp.initDataUnsafe?.user;
    if (telegramUser) {
      const { id: userId } = telegramUser;
      const userRef = doc(db, "telegramUsers", userId.toString());

      isUpdatingRef.current = true;

      try {
        await updateDoc(userRef, {
          balance: accumulatedBalanceRef.current,
          energy: accumulatedEnergyRef.current,
          tapBalance: accumulatedTapBalanceRef.current,
        });

        accumulatedBalanceRef.current = balance;
        accumulatedEnergyRef.current = energy;
        accumulatedTapBalanceRef.current = tapBalance;
      } catch (error) {
        console.error("Error updating balance and energy:", error);
      } finally {
        // Clear updating flag
        isUpdatingRef.current = false;
      }
    }
  };

  return (
    <div className="w-full min-h-screen text-white flex flex-col items-center gap-6 font-sans bg-[url('/src/assets/MainBackground.png')] overflow-hidden   bg-cover  pt-8 ">
      <div className="px-0 w-full">
        <Header />
      </div>
      <div className=" w-full flex justify-end px-6   ">
        <div className="flex gap-4 items-center">
          <Link
            to={"https://t.me/kvantsnews"}
            target="_blank"
            className=" bg-transparent border-gradAlt border float-right w-[202px]  px-4 py-2 rounded-full flex justify-center gap-2   items-center"
          >
            <span>Join Kvants</span>
            <img
              width={500}
              height={500}
              src={add}
              alt=""
              className="w-[33px]"
            />
          </Link>
          <div className="">
            <img
              width={1000}
              height={1000}
              src={paperPlane}
              className="w-[47px]"
              alt=""
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between w-full items-center px-6 my-[20px]">
        <button className="bg-[linear-gradient(90deg,#112946_0%,#2823A9_50%,#2100EC_100%)] flex gap-2 items-center px-4 py-2  rounded-full">
          <img
            src={star}
            width={500}
            height={500}
            className="w-[12px]"
            alt=""
          />
          <span>Leaderboard</span>
        </button>
        <button className="bg-[linear-gradient(90deg,#112946_0%,#2823A9_50%,#2100EC_100%)] flex gap-2 items-center px-4 py-2  rounded-full">
          <img
            src={flash}
            width={500}
            height={500}
            className="w-[25px]"
            alt=""
          />
          <span>30/1 hr</span>
        </button>
      </div>
      <div className="w-full flex justify-center items-center px-6">
        <button className="flex px-6  py-1 items-center gap-2 rounded-full min-w-[250px] justify-center bg-transparent border border-offwhite">
          <img
            src={kvaiCoin}
            width={500}
            height={500}
            alt="kviacoin"
            className="w-[33px]"
          />
          <span className="font-bold text-[20px]">{energy}/500</span>
        </button>
      </div>

      <div className="pb-2">
        <div
          onPointerDown={handleClick}
          className="max-w-[800px] mx-auto flex items-center justify-center relative "
        >
          <Container>
            <img
              src={robot}
              width={1000}
              height={1000}
              className=" h-[480px] wobble-img"
              ref={imgRef}
              priority
              loading="eager"
              alt="robot"
            />
            {clicks.map((click) => (
              <SlideUpText key={click.id} x={click.x} y={click.y}>
                +{tapValue.value}
              </SlideUpText>
            ))}
          </Container>
          <div className="flex items-center gap-2 fixed bottom-20 z-10">
            <img
              alt="logo"
              src={kvaiCoin}
              width={500}
              height={500}
              className="w-[64px] h-full"
            />
            <h1 className="text-[45px] font-extrabold">{balance + refBonus}</h1>
          </div>
          <img
            src={shadow}
            width={500}
            height={500}
            className="absolute bottom-0 w-full"
            alt=""
          />
        </div>
        <div className="">
          <Footer fixed={true} currentPage={0} />
        </div>
      </div>
    </div>
  );
};

export default Home;
