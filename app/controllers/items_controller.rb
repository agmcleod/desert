class ItemsController < ApplicationController
  def create
    @item = Item.new item_params
    @project = Project.find params[:project_id]

    respond_to do |format|
      if @item.save
        format.html { redirect_to @project }
        format.json { render json: @item }
      else
        format.html { render template: "projects/show" }
        format.json { render json: { errors: @item.errors }, status: 422 }
      end
    end
  end

  def index
    @items = Item.where(project_id: params[:project_id])
    respond_to do |format|
      format.html
      format.json { render json: CollectionDecorator.collection_as_id_map(@items) }
    end
  end

  def update
    @item = Item.find params[:id]
    respond_to do |format|
      if @item.update_attributes item_params
        format.html { redirect_to @project }
        format.json { render json: @item }
      else
        format.html { render template: "projects/show" }
        format.json { render json: { errors: @item.errors }, status: 422 }
      end
    end
  end

private

  def item_params
    params.require(:item).permit(:description, :project_id, :state, :title)
  end
end
