import { useSearchParams } from "next/navigation";

function ProgressBar() {
  const params = useSearchParams();
  const step = params.get("step") || "1";
  const array4 = [1, 2, 3, 4];

  return (
    <div className="flex items-center">
      <div className="w-7 h-7 rounded-full bg-mint" />
      {array4.map((i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-[100px] h-1 ${
              i < Number(step) ? "bg-mint" : "bg-gray-300"
            }`}
          />
          <div
            className={`w-7 h-7 rounded-full ${
              i < Number(step) ? "bg-mint" : "bg-gray-300"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

export default ProgressBar;
