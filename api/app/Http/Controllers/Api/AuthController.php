<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    public function me(Request $request)
    {
        return response()->json(Auth::user());
    }
    public function create(Request $request)
    {
        $array = ["error" => ""];

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'cpf' => 'required',
            'pais' => 'required',
            'estado' => 'required',
            'interesses' => 'nullable|array',
            'atividades' => 'nullable|array',
            'eventos' => 'nullable|array',
        ]);

        if (!$validator->fails()) {
            $name = $request->input("name");
            $email = $request->input("email");
            $password = $request->input("password");
            $cpf = $request->input("cpf");
            $pais = $request->input("pais");
            $estado = $request->input("estado");

            // Capturando os novos campos
            $interesses = $request->input("interesses", []);
            $atividades = $request->input("atividades", []);
            $eventos = $request->input("eventos", []);

            $emailExists = User::where("email", $email)->count();
            if ($emailExists === 0) {
                $hash = password_hash($password, PASSWORD_DEFAULT);
                $newUser = new User();

                $newUser->name = $name;
                $newUser->email = $email;
                $newUser->password = $hash;
                $newUser->cpf = $cpf;
                $newUser->pais = $pais;
                $newUser->estado = $estado;

                // Salvando os novos campos no banco
                $newUser->interesses = $interesses;
                $newUser->atividades = $atividades;
                $newUser->eventos = $eventos;

                $newUser->save();

                // Gerando o token de autenticação
                $token = auth()->attempt([
                    'email' => $email,
                    'password' => $password,
                ]);

                if (!$token) {
                    $array['error'] = "Ocorreu um erro";
                    return $array;
                }

                $info = auth()->user();
                $array['data'] = [
                    'user' => $info,
                    'token' => $token
                ];
            } else {
                $array['error'] = "Email já cadastrado";
                return $array;
            }
        } else {
            $array['error'] = "Dados incorretos";
            return $array;
        }

        return $array;
    }

    public function login(Request $request)
    {
        $credentials = $request->only(['email', 'password']);

        if (!$token = auth()->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = auth()->user();

        return response()->json([
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'cpf' => $user->cpf,
                    'pais' => $user->pais,
                    'estado' => $user->estado,
                    'interesses' => $user->interesses,
                    'atividades' => $user->atividades,
                    'eventos' => $user->eventos,
                ],
                'token' => $token
            ]
        ]);
    }


    public function logout()
    {
        auth()->logout();
        return response()->json(['success' => true]);
    }
}
