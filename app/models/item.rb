class Item < ActiveRecord::Base
  belongs_to :project

  validates :title, presence: true
  validates :description, presence: true

  before_save :init_state

private

  def init_state
    self.state = "todo" if self.state.nil?
  end

end
