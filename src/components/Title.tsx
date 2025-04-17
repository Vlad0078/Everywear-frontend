import React from "react";

interface TitleProps {
  text: string;
}

const Title: React.FC<TitleProps> = ({ text }) => {
  const words = text.trim().split(" ");

  return (
    <div className="inline-flex flex-wrap gap-2 items-center mb-3">
      {words.length > 1 ? (
        <p className="text-gray-500 uppercase">
          {words[0]}{" "}
          <span className="text-gray-700 font-medium">
            {words.slice(1).join(" ")}
          </span>
        </p>
      ) : (
        <p className="text-gray-700 font-medium uppercase">{text}</p>
      )}
      <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-gray-700"></p>
    </div>
  );
};

export default Title;
