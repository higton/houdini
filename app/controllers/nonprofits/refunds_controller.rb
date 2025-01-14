# frozen_string_literal: true

# License: AGPL-3.0-or-later WITH WTO-AP-3.0-or-later
# Full license explanation at https://github.com/houdiniproject/houdini/blob/main/LICENSE
module Nonprofits
  class RefundsController < ApplicationController
    include Controllers::Nonprofit::Current
  include Controllers::Nonprofit::Authorization

    before_action :authenticate_nonprofit_user!

    # post /charges/:charge_id/refunds
    def create
      charge = Qx.select('*').from('charges').where(id: charge_params[:charge_id]).execute.first
      params[:refund][:user_id] = current_user.id
      render_json { InsertRefunds.with_stripe(charge, charge_params['refund']) }
    end

    def index
      charge = current_nonprofit.charges.find(params[:charge_id])
      @refunds = charge.refunds
      render locals: {refunds: @refund}
    end

private

    def charge_params
      params.require(:charge_id, refund: [:amount])
    end
  end
end
