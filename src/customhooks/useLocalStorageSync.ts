
import { useEffect } from 'react';

export const useLocalStorageSync = (
  key: string,
  callback: (newValue: string) => void
) => {
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {//key ma chng thay
        callback(e.newValue || "1");//storage ma store thayel value e mathi mle
      }//and jyare key value null hse to default valu 1 set thai jse    
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);   // Cleanup  event listener for storage change
  }, [key, callback]);
};

//jyare local storage ma value change thay tyare e event fire thay
//e event handle karva mate useEffect ma event listener add kariye che
//e listener handleStorageChange function ne call kare che
//handleStorageChange function e event ma key check kare che
//jyare key match kare che to callback function ne call kare che
//callback function e newValue pass kare che    