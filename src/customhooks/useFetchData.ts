import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setGridData } from "../features/data/dataSlice";
import type { ApiResponse } from "../Types";

export const useFetchData = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState<Record<string, boolean>>(
    {}
  );

  const fetchData = useCallback(async () => {
    // debugger;
    try {
      setLoading(false);
      const response = await fetch("/data.json");
      // const response = await fetch("/dataShort.json");
      const responseData: ApiResponse = await response.json();

      if (
        responseData.success &&
        (responseData.data.items || responseData.data.sections)
      ) {
        dispatch(
          setGridData({
            items: responseData.data.items || [],
            sections: responseData.data.sections || [],
          })
        );
      } else {
        throw new Error("Error fetching data");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  const setSectionLoadingState = useCallback(
    (sectionId: string, isLoading: boolean) => {
      setSectionLoading((prev) => ({
        ...prev,
        [sectionId]: isLoading,
      }));
    },
    []
  );

  return { loading, fetchData, sectionLoading, setSectionLoadingState };
};
