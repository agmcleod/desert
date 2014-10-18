class AddProjectIdToItems < ActiveRecord::Migration
  def change
    add_column :items, :project_id, :integer
  end
end
