class ProjectsController < ApplicationController
  def create
    @project = Project.new project_params

    respond_to do |format|
      if @project.save
        format.html
        format.json { render json: @project.to_json }
      else
        format.html { render :new }
        format.json { render json: { errors: @project.errors }, status: 422 }
      end
    end
  end

  def index
    @projects = Project.order :title
    respond_to do |format|
      format.html
      format.json { render json: CollectionDecorator.collection_as_id_map(@projects) }
    end
  end

  def new
    
  end

  def show
    @project = Project.find params[:id]
    respond_to do |format|
      format.html
      format.json { render json: @project }
    end
  end

private

  def project_params
    params.require(:project).permit(:title, :description)
  end
end
