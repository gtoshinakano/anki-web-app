import React, { useState, useContext } from "react";
import { GiCardQueenHearts } from "react-icons/gi";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "../service/firebase";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { getFlashcards } from "../queries";
import { AuthContext } from "../hooks/Auth";

interface IForm {
  front: string;
  furigana: string;
  translate: string;
  uid: string;
}

const AddCardView: React.FC = () => {
  const user = useContext(AuthContext);
  const [form, setForm] = useState<IForm>(emptyForm);
  const client = useQueryClient();
  const { data: flashcards, isLoading } = useQuery(
    ["flashcards", user?.uid],
    getFlashcards,
    { staleTime: Infinity }
  );

  const singleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const doc = {
        ...form,
        created_at: serverTimestamp(),
        archived: false,
        check_count: 0,
        uid: user?.uid,
      };
      const docRef = await addDoc(collection(firestore, "flashcards"), doc);
      //TODO Add to React Query
      client.setQueryData(
        ["flashcards", user?.uid],
        [
          ...(flashcards || []),
          {
            id: docRef.id,
            ...doc,
          },
        ]
      );
    } catch (e) {
      console.log(e);
    } finally {
      setForm(emptyForm);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-2">
      <h1 className="flex font-bold">
        <GiCardQueenHearts className="text-3xl" />
        <span className="my-auto text-xl">Add Flashcard</span>
      </h1>
      <div className="grow w-full flex flex-col gap-1 mt-2">
        <h2 className="text-lg font-montserrat font-semibold">Front</h2>
        <input
          type="text"
          value={form.front}
          className="text-5xl w-4/5 mx-auto text-center p-2 ring-0 outline-0 border-none font-noto text-neutral-800 bg-transparent"
          placeholder="漢字"
          onChange={singleChange}
          name="front"
          maxLength={10}
          lang="ja"
        />
        <h2 className="text-lg font-montserrat font-semibold">Back</h2>
        <input
          type="text"
          value={form.furigana}
          className="text-4xl w-full mx-auto text-center p-2 ring-0 outline-0 border-none font-noto text-neutral-800 bg-transparent"
          placeholder="フリガナ"
          onChange={singleChange}
          name="furigana"
          maxLength={10}
          lang="ja"
        />
        <textarea
          value={form.translate}
          className="text-3xl w-full mx-auto text-center p-2 ring-0 outline-0 border-none font-noto text-neutral-800 bg-transparent"
          placeholder="Translation"
          onChange={singleChange}
          name="translate"
          rows={5}
        />
      </div>
      <button
        className="bg-gray-300 p-2 text-white text-lg"
        onClick={() => setForm(emptyForm)}
      >
        Reset
      </button>
      <button
        className="bg-blue-400 p-2 text-white text-lg disabled:bg-red-300 disabled:cursor-not-allowed"
        disabled={
          form.front === "" ||
          form.furigana === "" ||
          form.translate === "" ||
          isLoading
        }
        onClick={onSave}
      >
        Save Flashcard
      </button>
    </div>
  );
};

export default AddCardView;

const emptyForm = {
  front: "",
  furigana: "",
  translate: "",
  uid: "",
};
