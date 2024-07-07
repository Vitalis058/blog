import { Button } from "flowbite-react";

function CallToAction() {
  return (
    <div className="flex flex-col items-center justify-center rounded-br-3xl rounded-tl-3xl border border-teal-500 bg-[#98d7f9] p-3 text-center dark:bg-slate-700 sm:flex-row">
      <div className="flex flex-1 flex-col justify-center">
        <h2 className="text-2xl">Want to Learn more About JS</h2>
        <p className="my-3 text-gray-500">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Assumenda,
          laborum.
        </p>
        <Button
          // gradientDuoTone="purpleToPink"
          className="justify-self-center bg-[#41A1D7]"
        >
          Learn More
        </Button>
      </div>
      <div className=" flex-1 p-7">
        <img
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29kaW5nfGVufDB8fDB8fHww"
          alt="js logo"
        />
      </div>
    </div>
  );
}

export default CallToAction;
