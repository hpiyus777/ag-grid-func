import React, { createContext, useContext, useState, useEffect,type ReactNode } from 'react';
import type { TimeCard, CrewCard, CrewSheet, Timer } from '../../Types';

export interface TimeCardContextType {
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
    removeCrewCard: (id: string | number) => void;
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


  // In the TimeCardProvider component, add:
const removeCrewCard = (id: string | number) => {
  setCrewCards(prev => prev.filter(card => card.id !== id));
};
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

  const addCrewCard = (card: CrewCard): CrewCard => {
    setCrewCards(prev => [...prev, card]);
    return card;
  };


   const updateCrewCard = (id: string, updatedCard: CrewCard) => {
    setCrewCards(prev => 
      prev.map(card => card.id === id ? updatedCard : card)
    );
  };

  const addCrewSheet = (sheet: Omit<CrewSheet, 'id'>): CrewSheet => {
    const newSheet: CrewSheet = {
      ...sheet,
      id: Date.now(),
    };
    setCrewSheets(prev => [...prev, newSheet]);
    console.log("Adding Crew Sheet:", newSheet);
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
      updateCrewCard,
      startTimer,
      stopTimer,
      removeTimeCard,
      removeCrewCard
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