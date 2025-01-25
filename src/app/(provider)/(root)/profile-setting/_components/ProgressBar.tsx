import { useSearchParams } from "next/navigation";

function ProgressBar() {
  const params = useSearchParams();
  const step = params.get("step") || "1";
  const array4 = [1, 2, 3, 4];

  return (
    <div className="flex items-center">
      <div className="lg:w-7 lg:h-7 w-5 h-5 rounded-full bg-mint" />
      {array4.map((i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-[40px] lg:w-[100px] h-1 ${
              i < Number(step) ? "bg-mint" : "bg-gray-300"
            }`}
          />
          <div
            className={`lg:w-7 lg:h-7 min-w-5 min-h-5 rounded-full ${
              i < Number(step) ? "bg-mint" : "bg-gray-300"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export default ProgressBar;
