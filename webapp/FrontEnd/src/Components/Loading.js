import React, { useState, useCallback } from "react";
import { JobTable } from "./job-table/job-table.component";
import { Button, TextField } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

export default function App() {
  //user updates this via TextField
  const [minimumTime, setMinimumTime] = useState(500);
  const [minimumTimeElapsed, setMinimumTimeElapsed] = useState(true);
  const [loading, setLoading] = useState(false);

  const restartTimeout = useCallback(() => {
    
    setMinimumTimeElapsed(false);
    setLoading(true);
    const randomLoadTime = Math.random() * 5000;
    
    setTimeout(() => {
      setMinimumTimeElapsed(true);
    }, minimumTime);

    setTimeout(() => {
      setLoading(false);
    }, randomLoadTime);
    
  }, [setMinimumTimeElapsed, setLoading]);

  return (
    <div className="App">
      <div style={{ maxWidth: "100%", paddingTop: 12 }}>
        
        <Button
          variant="outlined"
          style={{ margin: 8, minWidth: 250 }}
          onClick={() => {
            restartTimeout();
          }}
        >
          Restart Skeleton Timer
        </Button>
        {!minimumTimeElapsed || loading ? (
          <Skeleton style={{ height: 200 }} />
        ) : (
          <JobTable />
        )}
      </div>
    </div>
  );
}
