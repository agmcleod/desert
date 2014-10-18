Rails.application.routes.draw do
  root to: "home#index"
  get "home" => "home#index"
  resources :projects do
    resources :items
  end
end
