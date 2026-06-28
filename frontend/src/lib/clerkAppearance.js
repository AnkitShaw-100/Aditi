const primaryButton =
  "min-h-11 rounded-none border border-ember/60 !bg-ember px-5 font-rajdhani text-sm font-bold uppercase tracking-[0.14em] !text-void shadow-none transition hover:!border-chalk hover:!bg-chalk hover:!text-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/60";

const secondaryButton =
  "min-h-11 rounded-none border border-steel/70 !bg-void/60 font-rajdhani text-sm font-bold tracking-[0.08em] !text-chalk shadow-none transition hover:!border-ember/60 hover:!bg-plate hover:!text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50";

const inputField =
  "min-h-11 rounded-none border border-steel/70 !bg-void/80 px-3 font-plex text-sm !text-chalk shadow-none transition placeholder:!text-fog focus:border-ember focus:ring-2 focus:ring-ember/30 focus-visible:outline-none";

const actionLink =
  "font-plex text-sm font-medium text-ember transition hover:text-chalk focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50";

export const clerkAppearance = {
  variables: {
    colorPrimary: "var(--color-ember)",
    colorText: "var(--color-chalk)",
    colorTextSecondary: "var(--color-ash)",
    colorTextOnPrimaryBackground: "var(--color-void)",
    colorBackground: "var(--color-bunker)",
    colorInputBackground: "var(--color-void)",
    colorInputText: "var(--color-chalk)",
    colorDanger: "var(--color-destructive)",
    borderRadius: "var(--radius)",
    fontFamily: "var(--font-plex)",
    fontFamilyButtons: "var(--font-rajdhani)",
    fontSize: "0.95rem",
    spacingUnit: "1rem",
  },
  layout: {
    socialButtonsPlacement: "top",
    socialButtonsVariant: "blockButton",
  },
  elements: {
    rootBox: "mx-auto flex w-full max-w-[28rem] justify-center",
    modalBackdrop:
      "!fixed !inset-0 !grid !place-items-center overflow-y-auto bg-void/85 p-4 backdrop-blur-xl",
    modalContent:
      "!static !m-auto w-[min(100%,28rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl",
    cardBox: "w-full overflow-hidden rounded-xl border border-steel/60 !bg-bunker shadow-2xl",
    card: "rounded-xl !bg-bunker p-6 !text-chalk shadow-none ring-0 sm:p-8",
    header: "gap-2 text-left",
    headerTitle: "font-rajdhani text-[clamp(1.8rem,7vw,2.35rem)] font-bold leading-none !text-chalk",
    headerSubtitle: "font-plex text-sm font-light leading-6 !text-ash",
    logoBox: "hidden",
    socialButtonsBlockButton: secondaryButton,
    socialButtonsBlockButtonText:
      "font-rajdhani text-sm font-bold uppercase tracking-[0.1em] !text-chalk",
    socialButtonsProviderIcon: "opacity-100",
    dividerLine: "bg-steel/60",
    dividerText: "font-plex text-xs uppercase tracking-[0.16em] !text-ash",
    formField: "gap-2",
    formFieldLabel:
      "font-plex text-xs font-medium uppercase tracking-[0.16em] !text-ember",
    formFieldInput: inputField,
    formFieldInputShowPasswordButton: "text-fog transition hover:text-ember",
    formFieldAction: actionLink,
    formButtonPrimary: primaryButton,
    footer: "!bg-transparent",
    footerAction: "gap-2",
    footerActionText: "font-plex text-sm !text-ash",
    footerActionLink: actionLink,
    identityPreview: "rounded-none border border-steel/60 bg-void/55 text-chalk",
    identityPreviewText: "font-plex text-sm text-chalk",
    identityPreviewEditButton: actionLink,
    otpCodeFieldInput: inputField,
    alert: "rounded-none border border-ember/40 bg-ember/10 font-plex text-sm text-chalk",
    formResendCodeLink: actionLink,
  },
};

export const clerkUserButtonAppearance = {
  variables: clerkAppearance.variables,
  elements: {
    avatarBox: "h-8 w-8 rounded-full border-0 shadow-none ring-1 ring-ember/40",
    modalBackdrop:
      "!fixed !inset-0 !grid !place-items-center overflow-y-auto bg-void/85 p-4 backdrop-blur-xl",
    modalContent:
      "!static !m-auto w-[min(100%,58rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-xl",
    userProfileRoot: "w-full max-w-[58rem] overflow-hidden rounded-xl border border-steel/60 !bg-bunker",
    userProfileNavbar: "min-w-[13rem] !bg-bunker/95",
    userProfilePage: "min-w-0 !bg-bunker !text-chalk",
    profileSection: "min-w-0",
    profileSectionContent: "min-w-0",
    form: "w-full min-w-0 max-w-[34rem]",
    formField: "w-full gap-2",
    formFieldInput: `${inputField} w-full`,
    formFieldLabel:
      "font-plex text-xs font-medium uppercase tracking-[0.16em] !text-ember",
    formFieldInputShowPasswordButton: "text-fog transition hover:text-ember",
    formButtonPrimary: primaryButton,
    formButtonReset: actionLink,
    userButtonPopoverCard:
      "rounded-xl border border-steel/60 !bg-bunker !text-chalk shadow-2xl",
    userButtonPopoverActionButton:
      "font-plex !text-ash transition hover:!bg-plate hover:!text-chalk focus-visible:ring-2 focus-visible:ring-ember/50",
    userButtonPopoverActionButtonText: "font-plex !text-ash",
    userButtonPopoverActionButtonIcon: "!text-ember",
    userPreviewMainIdentifier: "font-plex font-semibold !text-chalk",
    userPreviewSecondaryIdentifier: "font-plex !text-ash",
    userButtonPopoverFooter: "hidden",
  },
};
