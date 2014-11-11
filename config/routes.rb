Rails.application.routes.draw do
  root to: "home#index"
  get "home" => "home#index"
  resources :projects do
    resources :items, only: %w(create index)
  end
  resources :items, only: %w(update)
end
