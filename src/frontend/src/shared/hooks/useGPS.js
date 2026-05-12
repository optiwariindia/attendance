import { useState, useCallback } from "react";

export default function useGPS() {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getLocation = useCallback(() => {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                setError("Geolocation not supported");
                return resolve(null);
            }

            setLoading(true);
            setError(null);

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const gps = {
                        type: "Point",
                        coordinates: [
                            pos.coords.longitude,
                            pos.coords.latitude
                        ],
                        accuracy: pos.coords.accuracy
                    };

                    setLocation(gps);
                    setLoading(false);
                    resolve(gps);
                },
                (err) => {
                    setError(err.message || "Location permission denied");
                    setLoading(false);
                    resolve(null); // attendance should still proceed
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    }, []);

    return {
        location,
        loading,
        error,
        getLocation
    };
}
