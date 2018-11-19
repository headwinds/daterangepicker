(ns example.demos.picker
  (:require ["material-ui" :as mui]
            [reagent.core :as r]
            [example.demos.demo-text-field :refer [text-field]]
            [re-frame.core :as re-frame]))


;;-- Template - create a new component with this base as a starter

(def model-default {
   :to-date "10 29 2018"
   :to-time "12:00"
   :from-date "10 20 2018"
   :from-time "12:00"
   :range-selected 2
})

(def model (r/atom model-default))

(defn picker-view [classes]
  (r/create-class
   {
     :component-will-mount
     (fn [])

     :reagent-render
     (fn []
       [:div {:id "daterangepicker" :style {:display "block", :position "relative"}}

        [:div {:style {:display "flex" :margin-bottom 20 :flex-direciton "row" :justify-content "flex-start"}}

        [text-field
           {:id "baseSelect"
            :label "Date Range"
            :value (:range-selected @model)
            :placeholder ""
            :helper-text ""
            :on-change (fn [e]
                          (swap! model assoc :range-selected (.. e -target -value))
                          (.handleBaseSelectChange (.-drp js/window) e))
            :class (.-textField classes)
            :select true}

           [:> mui/MenuItem
            {:value 0}
            "Last 7 days"]

           [:> mui/MenuItem
            {:value 1}
            "Last Week"]

           [:> mui/MenuItem
            {:value 2}
            "Last 30 days"]

           [:> mui/MenuItem
            {:value 3}
            "Last Month"]

           [:> mui/MenuItem
            {:value 4}
            "Last 3 Months"]

            [:> mui/MenuItem
             {:value 5}
             "Last 6 Months"]

           [:> mui/MenuItem
            {:value 6}
            "Last 365 Days"]

            [:> mui/MenuItem
             {:value 7}
             "This Year"]

             [:> mui/MenuItem
              {:value 8}
              "Custom Dates"]]

              [:h4 {:id "baseRange"
                    :class "baseTitle"
                    :style {:margin 0
                            :margin-top 20;
                            :margin-left 45;
                            :font-weight "normal"
                            :margin-bottom 10}}]
            ]

            [:div {:style {:display (if (= (:range-selected @model) 8) "flex" "none") :flex-direciton "row" :justify-content "flex-start"}}


            [:div {:style {:display "flex" :flex-direciton "row" :justify-content "flex-start"}}

               [:div {:style {:margin-top 8 :color "#333" }}
                [:p  "From" ]]
              [text-field
               {:id "inputBaseStartDate"
                :label "Date"
                :value (:from-date @model)
                :type "text"
                :variant "outlined"
                :InputLabelProps {:shrink true :style {:font-size 14}}
                :InputProps {:style {:font-size 16 :color "#333" :width 100}}
                :style {:width 100}
                :placeholder "DD-MM-YYYY"
                :class (.-textField classes)
                :on-change (fn [e]
                            (swap! model #(-> %1 (assoc :from %2)) (.. e -target -value)))}]

                [text-field
                 {:id "inputBaseStartDateTime"
                  :label "Time"
                  :value (:from-time @model)
                  :type "time"
                  :variant "outlined"
                  :InputLabelProps {:shrink true :style {:font-size 14}}
                  :InputProps {:style {:font-size 16 :color "#333" :width 80}}
                  :placeholder "HH:MM"
                  :class (.-textField classes)
                  :on-change (fn [e]
                              (swap! model #(-> %1 (assoc :from %2)) (.. e -target -value)))}]]


                [:div {:style {:display "flex" :flex-direciton "row" :justify-content "flex-start"}}
                 [:div {:style {:margin-top 8 :color "#333" }}
                  [:p "To"]]
                  [text-field
                   {:id "inputBaseEndDate"
                    :label "Date"
                    :value (:from-date @model)
                    :type "text"
                    :variant "outlined"
                    :InputLabelProps {:shrink true :style {:font-size 14}}
                    :InputProps {:style {:font-size 16 :color "#333" :width 100}}
                    :style {:width 100}
                    :placeholder "DD-MM-YYYY"
                    :class (.-textField classes)
                    :on-change (fn [e]
                                (swap! model #(-> %1 (assoc :from %2)) (.. e -target -value)))}]

                    [text-field
                     {:id "inputBaseEndDateTime"
                      :label "Time"
                      :value (:from-time @model)
                      :type "time"
                      :variant "outlined"
                      :InputLabelProps {:shrink true :style {:font-size 14}}
                      :InputProps {:style {:font-size 16 :color "#333" :width 80}}
                      :style {:width 100}
                      :placeholder "HH:MM"
                      :class (.-textField classes)
                      :on-change (fn [e]
                                  (swap! model #(-> %1 (assoc :from %2)) (.. e -target -value)))}]]]

      [:div {:id "datepicker-calendar"} ]

      ])}))
