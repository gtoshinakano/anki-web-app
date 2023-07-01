import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ChangeEvent, useState } from "react";
import { auth } from "../service/firebase";

interface IForm {
  email: string;
  password: string;
}

const LoginView: React.FC = () => {
  const [form, setForm] = useState<IForm>({
    email: import.meta.env.VITE_LOCAL_USER || "",
    password: import.meta.env.VITE_LOCAL_PASS || "",
  });

  const singleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const signIn = (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, form.email, form.password);
  };

  return (
    <section className="w-full h-screen flex bg-zinc-100">
      <div className="bg-white rounded-md m-auto max-w-xs p-3 flex flex-col">
        <form
          onSubmit={signIn}
          className="bg-white rounded-md m-auto max-w-xs p-3 flex flex-col"
        >
          <h2 className="font-bold font-dm">Signin to use APP</h2>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            name="email"
            onChange={singleChange}
            className="mt-1.5 px-3 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={singleChange}
            className="mt-1.5 px-3 py-2 border rounded"
          />
          <button
            className="px-3 py-2 bg-blue-400 rounded mt-2 text-white capitalize"
            onClick={signIn}
            type="submit"
          >
            signin
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginView;
