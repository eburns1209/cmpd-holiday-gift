<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHouseholdPhone extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('household_phone', function (Blueprint $table) {
            $table->increments('id');

            $table->timestamps();

            $table->integer('household_id')->unsigned();
            $table->foreign('household_id')->references('id')->on('household');

            $table->string('phone_type');
            $table->string('phone_number');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('household_phone', function($table) {
            $table->dropForeign('household_id');
        });
        Schema::drop('household_phone');
    }
}
