<?php

namespace App\Http\Requests;

use App\Models\Patient;
use Illuminate\Foundation\Http\FormRequest;

class UpdatePatientRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $patient = $this->route('patient');
        if ($this->user()->id !== $patient->user_id) {
            return false;
        }
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'dob' => 'required|date',
            'nationalid' => 'required|string|max:255',
            'address' => 'required|string|max:255',
            'island_name' => 'required|string|max:255',
        ];
    }
}
