import { useState, useCallback } from "react";

export const useFavourite = (initialValue: boolean = false) => {
  const [isFavourite, setIsFavourite] = useState(initialValue);

  const toggleFavourite = useCallback(() => {
    setIsFavourite((prev) => !prev);
  }, []);

  return { isFavourite, toggleFavourite };
};
