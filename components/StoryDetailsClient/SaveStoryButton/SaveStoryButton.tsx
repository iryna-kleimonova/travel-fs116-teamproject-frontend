"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSaveStory } from "@/lib/hooks/useSaveStory";
import css from "./SaveStoryButton.module.css";
import Modal from "../../Modal/Modal";


type SaveStoryButtonProps = {
  storyId: string;
  initiallySaved: boolean;
};

export const SaveStoryButton = ({
  storyId,
  initiallySaved,
}: SaveStoryButtonProps) => {
  const [isSaved, setIsSaved] = useState(initiallySaved);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const router = useRouter();

  const { mutate, isPending } = useSaveStory(storyId, {
    onUnauthorized: () => {
      setIsAuthModalOpen(true);
    },
  });

  useEffect(() => {
    setIsSaved(initiallySaved);
  }, [initiallySaved]);

  const handleClick = () => {
    if (isSaved || isPending) return;

    mutate(undefined, {
      onSuccess: () => {
        setIsSaved(true);
      },
    });
  };

  const label = isPending
    ? "Зберігаю..."
    : isSaved
    ? "Історія збережена"
    : "Зберегти";

  return (
    <>
      <button
        className={css.button}
        type="button"
        onClick={handleClick}
        disabled={isPending || isSaved}
      >
        {label}
      </button>

      <Modal
        title="Помилка під час збереження"
        message="Щоб зберегти статтю вам треба увійти, якщо ще немає облікового запису зареєструйтесь"
        confirmButtonText="Зареєструватись"
        cancelButtonText="Увійти"
        onConfirm={() => {
          setIsAuthModalOpen(false);
          router.push("/auth/register");
        }}
        onCancel={() => {
          setIsAuthModalOpen(false);
          router.push("/auth/login");
        }}
        onClose={() => {
          setIsAuthModalOpen(false);
        }}
        isOpen={isAuthModalOpen}
      />
    </>
  );
};
