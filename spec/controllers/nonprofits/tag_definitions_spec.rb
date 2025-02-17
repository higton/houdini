# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/main/LICENSE
require 'rails_helper'
require 'controllers/support/shared_user_context'

describe Nonprofits::TagDefinitionsController, type: :controller do
  describe 'authorization' do
    include_context :shared_user_context
    describe 'rejects unauthorized users' do
      describe 'index' do
        include_context :open_to_np_associate, :get, :index, nonprofit_id: :__our_np
      end

      describe 'create' do
        include_context :open_to_np_associate, :post, :create, nonprofit_id: :__our_np
      end

      describe 'destroy' do
        include_context :open_to_np_associate, :delete, :destroy, nonprofit_id: :__our_np, id: '1'
      end
    end
  end
end
