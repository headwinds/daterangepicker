(ns example.demos.demo-pickers
  (:require [reagent.core :as r]
            ["material-ui" :as mui]
            ["material-ui-icons" :as mui-icons]
            [example.utils.js :as utils :refer [moment-parse moment-parse-format moment-parse-d-format reverse-to-yyyy]]
            [example.demos.picker :refer [picker-view]]
            [example.demos.demo-text-field :refer [text-field]]))


;; State
(def model-default {
   :to-date "2018-10-29"
   :to-date-display "16 10 2018"
   :to-time "13:30"
   :to "2018-10-29"
   :from "2018-10-29"
})

(def model (r/atom model-default))

(defn handle-date-change [e]
  (print "date change! " (.. e -target -value)) )

  (defn display-date []
    (:to-date-display @model)

  )

(defn handle-js-click [ev]
    (let [ ; how can I check it the window.drp is ready?!
           hello (if (.-drp js/window) (.getDateMoment (.-drp js/window) "BaseStart") "not ready")
           ]
  (print "hello" hello)))

(defn demo-pickers [{:keys [classes] :as props}]

  (r/create-class
   {
     :component-will-mount
     (fn [])

     :component-did-mount
     (fn []
       (let [ ; how can I check it the window.drp is ready?!
              ;hello (if (.-drp js/window) (.getDateMoment (.-drp js/window) "BaseStart") "not ready")
              ;_ (print "hello date: " hello)
              ]))

     :reagent-render
     (fn []
       (let []
       [:div {:style {:display "flex"
                      :flexDirection "column"
                      :position "relative"
                      :margin 50
                      :alignItems "left"
                      }}
         [:h2 {:style {:margin "20px 0px"}} "Date Range Picker"]

           

              [picker-view classes]

              [:div {:style {:margin-top 50}}
               [:> mui/Button
                {:variant "contained"
                 :color "secondary"
                 :style {:text-transform "none"}
                 :class (.-button classes)
                 :on-click handle-js-click }
                 [:div {:style {:margin-right 10}}
                   [:>  mui-icons/LocalCafe]]
                "Talk to Javascript"
                ]]

        ]
   ))}))
