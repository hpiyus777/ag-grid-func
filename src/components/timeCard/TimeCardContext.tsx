// import React, { createContext, useContext, useState, useEffect } from 'react';
// import type { ReactNode } from 'react';
// import type { 
//   TimeCard, 
//   CrewCard, 
//   CrewSheet, 
//   ActiveTimer, 
//   TimeCardContextType 
// } from '../../Types';

// const TimeCardContext = createContext<TimeCardContextType | undefined>(undefined);

// export const useTimeCard = (): TimeCardContextType => {
//   const context = useContext(TimeCardContext);
//   if (!context) {
//     throw new Error('useTimeCard must be used within TimeCardProvider');
//   }
//   return context;
// };

// interface TimeCardProviderProps {
//   children: ReactNode;
// }

// export const TimeCardProvider: React.FC<TimeCardProviderProps> = ({ children }) => {
//   const [timeCards, setTimeCards] = useState<TimeCard[]>([]);
//   const [crewCards, setCrewCards] = useState<CrewCard[]>([]);
//   const [crewSheets, setCrewSheets] = useState<CrewSheet[]>([]);
//   const [activeTimers, setActiveTimers] = useState<Record<number, ActiveTimer>>({});

//   useEffect(() => {
//     const savedTimeCards = localStorage.getItem('timeCards');
//     const savedCrewCards = localStorage.getItem('crewCards');
//     const savedCrewSheets = localStorage.getItem('crewSheets');
//     const savedActiveTimers = localStorage.getItem('activeTimers');

//     if (savedTimeCards) setTimeCards(JSON.parse(savedTimeCards));
//     if (savedCrewCards) setCrewCards(JSON.parse(savedCrewCards));
//     if (savedCrewSheets) setCrewSheets(JSON.parse(savedCrewSheets));
//     if (savedActiveTimers) setActiveTimers(JSON.parse(savedActiveTimers));
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('timeCards', JSON.stringify(timeCards));
//   }, [timeCards]);

//   useEffect(() => {
//     localStorage.setItem('crewCards', JSON.stringify(crewCards));
//   }, [crewCards]);

//   useEffect(() => {
//     localStorage.setItem('crewSheets', JSON.stringify(crewSheets));
//   }, [crewSheets]);

//   useEffect(() => {
//     localStorage.setItem('activeTimers', JSON.stringify(activeTimers));
//   }, [activeTimers]);

//   const addTimeCard = (timeCard: Omit<TimeCard, 'id' | 'date' | 'totalHours'>): TimeCard => {
//     const newTimeCard: TimeCard = {
//       ...timeCard,
//       id: Date.now(),
//       date: new Date().toISOString(),
//       totalHours: 0
//     };
//     setTimeCards([newTimeCard, ...timeCards]);
//     return newTimeCard;
//   };

//   const updateTimeCard = (id: number, updates: Partial<TimeCard>): void => {
//     setTimeCards(timeCards.map(card => 
//       card.id === id ? { ...card, ...updates } : card
//     ));
//   };

//   const addCrewCard = (crewCard: Omit<CrewCard, 'id' | 'date' | 'breaks'>): CrewCard => {
//     const newCrewCard: CrewCard = {
//       ...crewCard,
//       id: Date.now(),
//       date: new Date().toISOString(),
//       breaks: []
//     };
//     setCrewCards([newCrewCard, ...crewCards]);
//     return newCrewCard;
//   };

//   const updateCrewCard = (id: number, updates: Partial<CrewCard>): void => {
//     setCrewCards(crewCards.map(card => 
//       card.id === id ? { ...card, ...updates } : card
//     ));
//   };

//   const addCrewSheet = (crewSheet: Omit<CrewSheet, 'id' | 'date'>): CrewSheet => {
//     const newCrewSheet: CrewSheet = {
//       ...crewSheet, 
//       id: Date.now(),
//       date: new Date().toISOString()
//     };
//     setCrewSheets([newCrewSheet, ...crewSheets]);
//     return newCrewSheet;
//   };

//   const startTimer = (cardId: number, type: 'timecard' | 'crewcard'): void => {
//     setActiveTimers({
//       ...activeTimers,
//       [cardId]: {
//         startTime: Date.now(),
//         type
//       }
//     });
//   };

//   const stopTimer = (cardId: number): number => {
//     const timer = activeTimers[cardId];
//     if (timer) {
//       const elapsed = Date.now() - timer.startTime;
//       const newTimers = { ...activeTimers };
//       delete newTimers[cardId];
//       setActiveTimers(newTimers);
//       return elapsed;
//     }
//     return 0;
//   };

//   return (
//     <TimeCardContext.Provider value={{
//       timeCards,
//       crewCards,
//       crewSheets,
//       activeTimers,
//       addTimeCard,
//       updateTimeCard,
//       addCrewCard,
//       updateCrewCard,
//       addCrewSheet,
//       startTimer,
//       stopTimer
//     }}>
//       {children}
//     </TimeCardContext.Provider>
//   );
// };

// export default TimeCardContext;


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { TimeCard, CrewCard, CrewSheet, Timer } from '../../Types';

interface TimeCardContextType {
  timeCards: TimeCard[];
  crewCards: CrewCard[];
  crewSheets: CrewSheet[];
  activeTimers: Record<number, Timer>;
  addTimeCard: (card: Omit<TimeCard, 'id'>) => TimeCard;
  addCrewCard: (card: Omit<CrewCard, 'id'>) => CrewCard;
  addCrewSheet: (sheet: Omit<CrewSheet, 'id'>) => CrewSheet;
  startTimer: (id: number, type: 'timecard' | 'crewcard') => void;
  stopTimer: (id: number) => number;
  removeTimeCard: (id: number | string) => void;
}

const TimeCardContext = createContext<TimeCardContextType | undefined>(undefined);

export const TimeCardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [timeCards, setTimeCards] = useState<TimeCard[]>([]);
  const [crewCards, setCrewCards] = useState<CrewCard[]>([]);
  const [crewSheets, setCrewSheets] = useState<CrewSheet[]>([]);
  const [activeTimers, setActiveTimers] = useState<Record<number, Timer>>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const storedTimeCards = JSON.parse(localStorage.getItem('contextTimeCards') || '[]');
    setTimeCards(storedTimeCards);
  }, []);

  const addTimeCard = (card: Omit<TimeCard, 'id'>): TimeCard => {
    const newCard: TimeCard = {
      ...card,
      id: Date.now(),
    };
    setTimeCards(prev => {
      const updated = [...prev, newCard];
      localStorage.setItem('contextTimeCards', JSON.stringify(updated));
      return updated;
    });
    return newCard;
  };

  const addCrewCard = (card: Omit<CrewCard, 'id'>): CrewCard => {
    const newCard: CrewCard = {
      ...card,
      id: Date.now(),
    };
    setCrewCards(prev => [...prev, newCard]);
    return newCard;
  };

  const addCrewSheet = (sheet: Omit<CrewSheet, 'id'>): CrewSheet => {
    const newSheet: CrewSheet = {
      ...sheet,
      id: Date.now(),
    };
    setCrewSheets(prev => [...prev, newSheet]);
    return newSheet;
  };

  const startTimer = (id: number, type: 'timecard' | 'crewcard') => {
    setActiveTimers(prev => ({
      ...prev,
      [id]: { startTime: Date.now(), type }
    }));
  };

  const stopTimer = (id: number): number => {
    const timer = activeTimers[id];
    if (!timer) return 0;

    const elapsed = Date.now() - timer.startTime;
    
    // Update the card status
    if (timer.type === 'timecard') {
      setTimeCards(prev => {
        const updated = prev.map(card => 
          card.id === id 
            ? { ...card, status: 'inactive' as const, totalHours: elapsed }
            : card
        );
        localStorage.setItem('contextTimeCards', JSON.stringify(updated));
        return updated;
      });
    }

    // Remove from active timers
    setActiveTimers(prev => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });

    return elapsed;
  };

  const removeTimeCard = (id: number | string) => {
    // Remove from state
    setTimeCards(prev => {
      const updated = prev.filter(card => card.id !== id);
      localStorage.setItem('contextTimeCards', JSON.stringify(updated));
      return updated;
    });
    
    // Remove from active timers if exists
    setActiveTimers(prev => {
      const { [id as number]: _, ...rest } = prev;
      return rest;
    });
  };

  return (
    <TimeCardContext.Provider value={{
      timeCards,
      crewCards,
      crewSheets,
      activeTimers,
      addTimeCard,
      addCrewCard,
      addCrewSheet,
      startTimer,
      stopTimer,
      removeTimeCard,
    }}>
      {children}
    </TimeCardContext.Provider>
  );
};

export const useTimeCard = () => {
  const context = useContext(TimeCardContext);
  if (!context) {
    throw new Error('useTimeCard must be used within a TimeCardProvider');
  }
  return context;
};