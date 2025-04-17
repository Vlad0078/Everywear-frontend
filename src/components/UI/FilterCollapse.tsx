import React, { PropsWithChildren, ReactNode, useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";

interface FilterCollapseProps extends PropsWithChildren {
  titleElement: ReactNode;
  openByDefault?: boolean;
  title: string;
}

const FilterCollapse: React.FC<FilterCollapseProps> = ({
  titleElement,
  openByDefault,
  children,
  title,
}) => {
  if (openByDefault === undefined) openByDefault = true;

  const [isOpen, setIsOpen] = useState(openByDefault);
  const [contentHeight, setContentHeight] = useState<number | undefined>();
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Функция для пересчета высоты
    const updateHeight = () => {
      if (contentRef.current && contentRef.current.scrollHeight) {
        setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
      }
    };

    // Добавляем обработчик события после завершения анимации
    const container = contentRef.current;
    if (container) {
      container.addEventListener("transitionstart", () => {
        updateHeight();
      });
    }

    // Обновляем высоту при изменении состояния isOpen
    updateHeight();

    // Очистка при размонтировании компонента
    return () => {
      if (container) {
        container.removeEventListener("transitionend", updateHeight);
      }
    };
  }, [isOpen, children]);

  return (
    <div>
      <div className="cursor-pointer flex gap-4 items-center" onClick={() => setIsOpen(!isOpen)}>
        {titleElement}
        <img
          src={assets.dropdown_icon}
          className={`h-3 ${isOpen ? "-" : ""}rotate-90 transition-transform duration-300`}
          alt=""
        />
      </div>

      <div
        ref={contentRef}
        style={{
          transition: "max-height 0s ease-in-out",
          overflow: "hidden",
          maxHeight: `${contentHeight ?? (openByDefault ? "fit-content" : "0")}px`,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default FilterCollapse;
