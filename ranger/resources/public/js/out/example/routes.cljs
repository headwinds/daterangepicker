(ns example.routes
  "Sets up url routes and associated views."
  (:require-macros [secretary.core :refer [defroute]])
  (:import goog.History)
  (:require [secretary.core :as secretary]
            [goog.events :as gevents]
            [goog.history.EventType :as EventType]
            [re-frame.core :as re :refer [reg-sub]]
            [reagent.core :as r]
            [example.events :as events]
            [example.subs :as subs]
            [example.utils.http-fx :refer  [GET POST PUT <sub >evt]]
            ;; demos
            [example.demos.demo-pickers :as demo-pickers]

            ))

(defn hook-browser-navigation! []
  (doto (History.)
    (gevents/listen
     EventType/NAVIGATE
     (fn [event]
       (secretary/dispatch! (.-token event))))
    (.setEnabled true)))

(defn app-routes []
  ;; prefix might be removeable --> https://gist.github.com/city41/aab464ae6c112acecfe1
  (secretary/set-config! :prefix "#")

  ;; Routes:start --------------------

  (defroute "/" []
    (re/dispatch [::events/set-active-demo "pickers"]))

  ;; Routes:end --------------------

  (hook-browser-navigation!))

(defn get-main-demo [demo-name]
  (case demo-name
    "pickers"               demo-pickers/demo-pickers)
)
