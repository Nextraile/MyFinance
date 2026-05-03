<?php

namespace App\Http\Requests\API\V1\User\Auth;

use App\Models\User;
use App\Services\API\V1\AuthService;
use Illuminate\Support\Facades\Hash;

class LoginRequest extends BaseRequest
{
    public ?User $user;
    public ?string $deviceHash;

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
        if ($this->routeIs('api.v1.auth.login.new-device')) {
            return [
                'key' => 'required|string',
            ];
        }

        return [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string',
        ];
    }

    public function messages()
    {
        return array_merge_recursive(parent::messages(), [
            //
        ]);
    }

    public function prepareForValidation()
    {
        if ($this->routeIs('api.v1.auth.login.new-device')) {
            if ($this->route('key')) {
                $this->merge([
                    'key' => $this->route('key'),
                ]);
            }
        }
    }

    protected function passedValidation()
    {
        if ($this->routeIs('api.v1.auth.login.new-device')) {
            $key = $this->safe()->key;
            $values = AuthService::make()->retrieveEncryptedCachedData("new_device_login", $key);

            if (empty($values) || !is_array($values)) {
                 abort(422, 'Invalid credentials.');
            }

            $userId = $values['user_id'] ?? null;

            $this->user = User::where('id', $userId)->first();
            $this->deviceHash = $values['device_hash'] ?? null;

        } 
        
        if ($this->routeIs('api.v1.auth.login')) {
            $this->user = User::where('email', $this->input('email'))->first();
            $this->deviceHash = AuthService::make()->hashDevice($this->user->id, $this->userAgent());
        }

        if (!$this->user) {
            abort(422, 'Invalid credentials.');
        }

        if ($this->routeIs('api.v1.auth.login')) {
            if (!Hash::check($this->input('password'), $this->user->password)) {
                abort(422, 'Invalid credentials.');
            }
        }
    }
}
