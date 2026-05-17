{{- define "breeze.name" -}}
breeze
{{- end -}}

{{- define "breeze.fullname" -}}
{{- printf "%s" (include "breeze.name" .) -}}
{{- end -}}

{{- define "breeze.labels" -}}
app.kubernetes.io/name: {{ include "breeze.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end -}}
