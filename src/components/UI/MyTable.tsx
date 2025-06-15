import React from "react";

type MyTableProps = {
  matrix: string[][];
};

const MyTable: React.FC<MyTableProps> = ({ matrix }) => {
  const [header, ...rows] = matrix;

  return (
    <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-200 max-w-full">
      <table className="min-w-full text-sm text-left border-collapse table-fixed">
        <thead className="bg-gray-900 text-white uppercase tracking-wide text-xs sm:text-sm">
          <tr>
            {header.map((cell, idx) => (
              <th
                key={idx}
                className={`px-1 py-2 sm:px-2 sm:py-3 text-center whitespace-normal break-words ${
                  idx < header.length - 1 ? "border-r border-gray-600" : ""
                }`}
                style={{ width: `${100 / header.length}%` }}
              >
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white text-gray-900">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-1 py-1 sm:px-2 sm:py-2 text-center whitespace-normal break-words text-xs sm:text-sm ${
                    cellIndex < row.length - 1 ? "border-r border-gray-200" : ""
                  }`}
                  style={{ width: `${100 / header.length}%` }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyTable;
