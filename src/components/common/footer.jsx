import { boost, friend, quest, tapAndEarn } from "../../assets";
import classNames from "classnames";
import { Link } from "react-router-dom";

const Footer = ({ currentPage = 0, fixed = true }) => {
  return (
    <div
      className={classNames(
        "w-11/12 mx-auto bg-[#0C0F47E5] p-1 rounded-full grid grid-cols-4 ",
        { "fixed bottom-2 left-1/2 -translate-x-1/2": fixed }
      )}
    >
      <Link
        to={"/"}
        className={classNames("flex items-center justify-center flex-col", {
          "bg-[#0A0318] rounded-full w-20 mx-auto py-1": currentPage === 0,
          "filter grayscale": currentPage !== 0,
        })}
      >
        <img
          width={500}
          height={500}
          src={tapAndEarn}
          alt=""
          className="h-7 w-7 mx-auto"
        />
        <span className="text-xs">Tap & Earn</span>
      </Link>
      <Link
        to={"/"}
        className={classNames("flex items-center justify-center flex-col", {
          "bg-[#0A0318] rounded-full w-20 mx-auto py-1": currentPage === 3,
          "filter grayscale": currentPage !== 3,
        })}
      >
        <img
          width={500}
          height={500}
          src={boost}
          alt=""
          className="h-7 w-7 mx-auto"
        />
        <span className="text-xs">Boost</span>
      </Link>
      <Link
        to={"/tasks"}
        className={classNames("flex items-center justify-center flex-col", {
          "bg-[#0A0318] rounded-full w-20 mx-auto py-1": currentPage === 3,
          "filter grayscale": currentPage !== 3,
        })}
      >
        <img
          width={500}
          height={500}
          src={quest}
          alt=""
          className="h-7 w-7 mx-auto"
        />
        <span className="text-xs">Quest</span>
      </Link>
      <Link
        to={"/refer"}
        className={classNames("flex items-center justify-center flex-col", {
          "bg-[#0A0318] rounded-full w-20 mx-auto py-1": currentPage === 3,
          "filter grayscale": currentPage !== 3,
        })}
      >
        <img
          width={500}
          height={500}
          src={friend}
          alt=""
          className="h-7 w-7 mx-auto"
        />
        <span className="text-xs">Friends</span>
      </Link>
    </div>
  );
};

export default Footer;
