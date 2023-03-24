import { HttpClient } from "@angular/common/http";
import { Actions, ofType } from "@ngrx/effects";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import * as AuthActions from "./auth.actions";
import { environment } from "src/environments/environment";
import { createEffect } from "@ngrx/effects";
import { of } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {
  authLogin = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.LOGIN_START),
      switchMap((authData: AuthActions.LoginStart) => {
        return this.http
          .post<AuthResponseData>(
            "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" +
              environment.firebaseAPIKey,
            {
              email: authData.payload.email,
              password: authData.payload.password,
              returnSecureToken: true,
            }
          )
          .pipe(
            map((resData) => {
              const expirationDate = new Date(
                new Date().getTime() + +resData.expiresIn * 1000
              );
              return new AuthActions.Login({
                email: resData.email,
                userId: resData.localId,
                token: resData.idToken,
                expirationDate: expirationDate,
              });
            }),
            catchError((errorRes) => {
              //...return non-error Observable so our stream doesn't die
              let errorMessage = "An unknown error occured!";
              if (!errorRes.error || !errorRes.error.error) {
                return of(new AuthActions.LoginFail(errorMessage));
              }
              switch (errorRes.error.error.message) {
                case "EMAIL_EXISTS":
                  errorMessage = "This email already exists";
                  break;
                case "EMAIL_NOT_FOUND":
                  errorMessage = "This email is not found";
                  break;
                case "INVALID_PASSWORD":
                  errorMessage = "Wrong password";
              }
              return of(new AuthActions.LoginFail(errorMessage));
            })
          );
      })
    )
  );

  authSuccess = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        tap(() => {
          this.router.navigate(["/"]);
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}
