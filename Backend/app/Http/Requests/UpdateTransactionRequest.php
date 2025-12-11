<?php

namespace App\Http\Requests;

use Illuminate\Http\Exceptions\HttpResponseException;
use App\Helpers\ResponseHelper;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:50',
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:255',
            'image' => 'nullable|image|max:102400', // max 100MB
            'transaction_date' => 'required|date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages()
    {
        return [];
    }

    /**
     * Handle a failed validation attempt.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            ResponseHelper::validationErrorResponse($validator)
        );
    }
}
