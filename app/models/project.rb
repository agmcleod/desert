class Project < ActiveRecord::Base
  has_many :items

  validates :title, presence: true
  validates :description, presence: true
end
