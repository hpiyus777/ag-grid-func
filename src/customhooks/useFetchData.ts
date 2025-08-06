import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGridData } from "../features/data/dataSlice";
import type { RootState } from "../Store/Store";
import type { ApiResponse } from "../Types";

export const useFetchData = () => {
  const dispatch = useDispatch();
  const hasFetchedData = useSelector(
    (state: RootState) => state.data.hasFetchedData
  );

  const [loading, setLoading] = useState(false);
  const [sectionLoading, setSectionLoading] = useState<Record<string, boolean>>(
    {}
  );

  const fetchData = useCallback(async () => {
    if (hasFetchedData) return; // skip if already fetched

    try {
      setLoading(true);
      const response = await fetch("/dataShort.json");
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
  }, [dispatch, hasFetchedData]);

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
