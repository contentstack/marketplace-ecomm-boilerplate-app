import React from "react";
import localText from "../common/locale/en-us";

/**
 * AppFailed component.
 * This components will be rendered if the App fails to initialize.( ContentStack SDK)
 */
const AppFailed: React.FC = function () {
  return (
    <div className="app-failed-container">
      <div className="app-component-container" role="alert">
        <div className="app-content">
          <svg
            className="app-icon"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <h3>{localText.appFailedText.errorMessage}</h3>
        </div>
        <div className="app-text">{localText.appFailedText.appText}</div>
        <div className="secondary-app-container">
          <button type="button">
            <svg
              className="app-learn-more"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path
                fillRule="evenodd"
                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                clipRule="evenodd"
              />
            </svg>
            {localText.appFailedText.learnMore}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AppFailed;
