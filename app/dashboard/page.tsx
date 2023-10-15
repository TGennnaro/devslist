import { title, subtitle } from "@/components/primitives";
export default function Dashboard() {
  const name = "John";
  return (
    <>
      <h1 className={title()}>Hey, </h1>
      <h1 className={title({ color: "blue" })}>{name}</h1>
      <h1 className={title()}>!</h1>
    </>
  );
}
