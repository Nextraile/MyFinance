<?php

namespace App\Http\Requests\API\V1\User\Auth;

use App\Models\User;
use App\Services\API\V1\AuthService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ResetPasswordRequest extends FormRequest
{
    public User $user;

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
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ]
        ];
    }

    public function prepareForValidation()
    {
        $encryptedToken = $this->route('credentials');
        $decryptedData = AuthService::make()->decryptPasswordResetToken($encryptedToken);
        
        $this->merge($decryptedData);
    }

    public function passedValidation()
    {
        $email = $this->safe()->email;
        $token = $this->safe()->token;

        if (!AuthService::make()->isPasswordResetTokenValid($email, $token)) {
            abort(422, 'Invalid credentials');
        }

        $this->user = User::where('email', $email)->first();
    }
}
