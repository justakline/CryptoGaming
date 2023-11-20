import { useState, useEffect } from 'react';

export default function useCountdown(){
    const [seconds, setSeconds] = useState(1);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if(seconds <= 0){
            return;
        }
        else{
            const timeout = setTimeout(() => {
                setSeconds(seconds - 1);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [seconds]);

    function start(seconds){
        setSeconds(seconds);
        setIsActive(true);
    }

    return { seconds, start, isActive };
}