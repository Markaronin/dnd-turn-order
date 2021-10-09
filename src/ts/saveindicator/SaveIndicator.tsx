import React, { useEffect, useState } from "react";
import { APIHelper } from "../api-helper";
import { LatestState } from "../StateVersionHandler";

interface SaveIndicatorProps {
    state: LatestState;
}

export const SaveIndicator = ({ state }: SaveIndicatorProps): JSX.Element => {
    const [timeoutId, setTimeoutId] = useState<number | undefined>();

    useEffect(() => {
        window.clearTimeout(timeoutId);
        setTimeoutId(
            window.setTimeout(async () => {
                await APIHelper.putData(state);
                setTimeoutId(undefined);
            }, 2000),
        );
        /* eslint react-hooks/exhaustive-deps: 0 */
    }, [state]);

    return <div>{(timeoutId !== undefined && "Not saved") || "Saved"}</div>;
};
