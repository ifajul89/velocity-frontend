import * as React from "react";
import { cn } from "@/lib/utils";

interface SliderProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue"> {
  value?: number[];
  defaultValue?: number[];
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    {
      className,
      value,
      defaultValue = [0, 100],
      min = 0,
      max = 100,
      step = 1,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const [values, setValues] = React.useState<number[]>(value || defaultValue);

    const handleChange = (index: number, newValue: number) => {
      const updatedValues = [...values];
      updatedValues[index] = newValue;
      setValues(updatedValues);
      onValueChange?.(updatedValues);
    };

    React.useEffect(() => {
      if (value) {
        setValues(value);
      }
    }, [value]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full touch-none items-center py-4 select-none",
          className,
        )}
        {...props}
      >
        <div className="relative h-2 w-full rounded-full bg-gray-200">
          <div
            className="absolute h-full bg-blue-500"
            style={{
              left: `${((values[0] - min) / (max - min)) * 100}%`,
              right: `${100 - ((values[1] - min) / (max - min)) * 100}%`,
            }}
          />
        </div>

        {values.map((val, index) => (
          <input
            key={index}
            type="range"
            min={min}
            max={max}
            step={step}
            value={val}
            onChange={(e) => handleChange(index, Number(e.target.value))}
            className={cn(
              "absolute h-5 w-5 appearance-none",
              index === 0 ? "left-0" : "right-0",
              "z-10 cursor-pointer opacity-0",
            )}
            style={{
              left:
                index === 0 ? `${((val - min) / (max - min)) * 100}%` : "auto",
              right:
                index === 1
                  ? `${100 - ((val - min) / (max - min)) * 100}%`
                  : "auto",
            }}
          />
        ))}

        {values.map((val, index) => (
          <div
            key={`thumb-${index}`}
            className="pointer-events-none absolute h-5 w-5 rounded-full border-2 border-blue-500 bg-white"
            style={{
              left:
                index === 0
                  ? `calc(${((val - min) / (max - min)) * 100}% - 10px)`
                  : "auto",
              right:
                index === 1
                  ? `calc(${100 - ((val - min) / (max - min)) * 100}% - 10px)`
                  : "auto",
            }}
          />
        ))}
      </div>
    );
  },
);

Slider.displayName = "Slider";

export { Slider };
