class ItemsController < ApplicationController
  def index
    @items = Item.where(project_id: params[:project_id])
    respond_to do |format|
      format.html
      format.json { render json: @items }
    end
  end
end
