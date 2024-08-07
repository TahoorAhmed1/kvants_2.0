import { useState } from "react";
import { useUser } from "../../context";
import { icons } from "../../utils/icons";
import { add, kvaiCoin, speaker } from "../../assets";
import Header from "../common/header";

const ReferalSystem = () => {
  const { telegramUser, referrals } = useUser();
  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    const reflink = `https://t.me/kvantsdemobot?start=r${telegramUser?.id}`;

    const textArea = document.createElement("textarea");
    textArea.value = reflink;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
    document.body.removeChild(textArea);

    alert("copied");
  };

  return (
    <div className="w-full min-h-screen text-white flex flex-col items-center gap-6 font-sans bg-[url('/src/assets/MainBackground.png')] overflow-x-hidden   bg-cover  ">
      <div className="px-0 w-full">
        <Header />
      </div>
      <div className="w-full flex items-center px-6 justify-center bg-transparent">
        <h1 className="text-2xl font-bold">Invite & Earn</h1>
      </div>
      <div className=" w-full flex justify-end pr-8">
        <div className="flex gap-4 items-center">
          <button
            className=" border
              bg-[linear-gradient(90deg,#0A0318_0%,#35107E_100%)]  float-right w-[240px]    px-3 py-1 rounded-full flex justify-center  gap-2 items-center bg-transparent border-gradAlt"
          >
            <span className={`text-[16px]  font-normal`}>Invite a friend</span>
            <img
              width={500}
              height={500}
              src={add}
              alt="add"
              className="w-[43px]"
            />
          </button>
          <div className="cursor-pointer" onClick={copyToClipboard}>
            {icons?.copy}
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center text-sm gap-2 font-sans px-4 text-center">
        <img
          src={speaker}
          width={500}
          height={500}
          alt=""
          className="w-[146px] mx-auto"
        />
        <span>Earn 30% of your friend income everyday</span>
        <span>Earn 50% of the income generated by your friend’s referal</span>
      </div>
      <div className="flex flex-col gap-4 w-full px-3">
        <div className="w-full flex items-start justify-start ">
          <h4 className="font-bold">List of friends</h4>
        </div>

        <div className="flex flex-col gap-2 w-full max-h-[250px] overflow-y-auto">
          {referrals?.length === 0 ? (
            <div className="text-xs">Your list is empty </div>
          ) : null}
          {referrals?.map((user, i) => (
            <div
              key={i}
              className=" border-gradAlt border  bg-[linear-gradient(90deg,#000B95_0%,#47484F_100%)] 
           px-3 py-2 rounded-[20px] w-full flex items-center  gap-4"
            >
              <span>{i + 1}</span>
              <div className="flex gap-2">
                <div className="w-[52.5px] h-[52.5px] text-center flex items-center justify-center text-[18px] bg-black rounded-full">
                  {user?.username.charAt(0)}
                </div>
                <div className="">
                  <p className="text-[16px] mb-[5px]">{user?.username}</p>
                  <div className="flex items-center gap-1 text-[15px] ">
                    <img
                      width={500}
                      height={500}
                      src={kvaiCoin}
                      alt=""
                      className="w-5 h-5"
                    />
                    <span className="font-bold"> 50000</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferalSystem;
