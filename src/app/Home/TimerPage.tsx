"use client";
import { ErrorBoundary } from "react-error-boundary";
import "./style.css";
import { TimerControls } from "./component/TimerControls";
import { TimerDisplay } from "./component/TimerDisplay";
import { useTimerPageController } from "./hooks/useTimerPageController";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { PageErrorFallback } from "@/components/PageErrorFallback";

export default function TimerPage() {
  const { isLoggedIn } = useIsLoggedIn();

  // 타이머 페이지 컨트롤러
  const { todoTitle, isTimerRunning, isTimerPaused, display, handlers } =
    useTimerPageController(isLoggedIn);

  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <PageErrorFallback {...props} message="타이머를 불러오지 못했습니다." />
      )}
    >
      <main className="mainPageWrap">
        <div className="timerContainer">
          <h2 className="timerTitle">{todoTitle}</h2>

          <TimerDisplay
            hours={display.hours}
            minutes={display.minutes}
            seconds={display.seconds}
          />

          <TimerControls
            isTimerRunning={isTimerRunning}
            isTimerPaused={isTimerPaused}
            isStartDisabled={display.isStartDisabled}
            isPauseDisabled={display.isPauseDisabled}
            isFinishDisabled={display.isFinishDisabled}
            onStartOrResume={handlers.onStartOrResume}
            onPause={handlers.onPause}
            onFinish={handlers.onFinish}
            onOpenEdit={handlers.onOpenEdit}
            onReset={handlers.onReset}
          />
        </div>
      </main>
    </ErrorBoundary>
  );
}
